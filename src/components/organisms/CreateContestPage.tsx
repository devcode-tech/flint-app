"use client";

import React, {
  useState,
  useRef,
  lazy,
  Suspense,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Ticket, ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/molecules/Breadcrumb";
import { Stepper } from "@/components/molecules/Stepper";
import { BasicDetailsForm } from "@/components/organisms/BasicDetailsForm";
import { ContestPreview } from "@/components/organisms/ContestPreview";
import { PostCapturePreview } from "@/components/organisms/PostCapturePreview";
import { PostContestPreview } from "@/components/organisms/PostContestPreview";
import { cn } from "@/lib/utils";
import {
  completeContestSchema,
  type CompleteContestData,
} from "@/schemas/contestSchema";
import { debounce } from "@/lib/utils/debounce";
import { generateFormId } from "@devcode-tech/form-builder";
import { useFormSchema } from "@/hooks/useFormSchema";
import { useContestApi } from "@/hooks/useContestApi";
import { EmbedCodeSection } from "./EmbedCodeSection";

// Lazy load heavy components
const ContestFormBuilder = lazy(() =>
  import("@/components/organisms/ContestFormBuilder").then((mod) => ({
    default: mod.ContestFormBuilder,
  }))
);
const ActionsForm = lazy(() => import("@/components/organisms/ActionsForm"));
const PostCaptureForm = lazy(
  () => import("@/components/organisms/PostCaptureForm")
);
const PostContestForm = lazy(
  () => import("@/components/organisms/PostContestForm")
);
const TargetingForm = lazy(
  () => import("@/components/organisms/TargetingForm")
);

// Loading component
const FormLoading = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-[#E4E7EC] border-t-[#005EB8] rounded-full animate-spin" />
      <p className="text-sm text-[#637083]">Loading...</p>
    </div>
  </div>
);

interface ContestFormStep {
  id: string;
  title: string;
  status?: "completed" | "current" | "upcoming";
}

const steps: ContestFormStep[] = [
  { id: "basic-details", title: "Basic Details" },
  { id: "create-form", title: "Create Form" },
  { id: "actions", title: "Actions" },
  { id: "post-capture", title: "Post Capture" },
  { id: "post-contest", title: "After Contest Ends" },
  { id: "targeting", title: "Targeting" },
  { id: "share", title: "Share" },
];

interface CreateContestPageProps {
  contestId?: string;
}

export const CreateContestPage: React.FC<CreateContestPageProps> = ({
  contestId,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const [savedFormId, setSavedFormId] = useState<string | null>(null);
  const [savedDbFormId, setSavedDbFormId] = useState<string | null>(null); // Database UUID
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingContest, setIsLoadingContest] = useState(!!contestId);
  const [contestName, setContestName] = useState<string>(""); // Store contest name for header
  const { fetchFormSchemaById, createFormSchema, updateFormSchema } =
    useFormSchema();
  const { updateContest, fetchContest } = useContestApi();

  // Single useForm instance for all contest data
  const form = useForm<CompleteContestData>({
    resolver: zodResolver(completeContestSchema),
    mode: "onBlur", // Changed from onChange for better performance
    defaultValues: {
      basicDetails: {
        name: "",
        contestType: "",
        startDate: "",
        endDate: "",
      },
      formBuilder: {
        formId: undefined,
        formTitle: "Contest Entry Form",
        formDescription: "",
        fields: [],
        containers: [],
        design: {},
      },
      actions: {
        rewardType: "",
        chooseReward: "",
      },
      postCapture: {
        behaviour: "",
        autoclose: "",
        title: "",
        description: "",
        url: "",
      },
      postContest: {
        content: "",
      },
      targeting: {
        audienceSegment: "",
      },
    },
  });

  const { handleSubmit, watch, setValue, getValues, reset } = form;

  // Watch form builder data for preview
  const formBuilderData = watch("formBuilder");

  // Watch post capture data for preview
  const postCaptureData = watch("postCapture");

  // Watch post contest data for preview
  const postContestData = watch("postContest");

  // Watch end date for post contest form
  const endDate = watch("basicDetails.endDate");

  // Watch contest name for header
  const watchedContestName = watch("basicDetails.name");

  // Load contest data if contestId is provided
  useEffect(() => {
    if (!contestId) return;

    const loadContestData = async () => {
      try {
        setIsLoadingContest(true);
        console.log("Loading contest data for:", contestId);

        // Fetch contest data using API hook
        const contestData = await fetchContest(contestId);

        if (contestData) {
          console.log("Contest data loaded:", contestData);

          const formatDateForInput = (dateString: string) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
          };

          // Basic Details
          setValue("basicDetails.name", contestData.name || "");
          setValue("basicDetails.contestType", contestData.contest_type || "");
          setValue(
            "basicDetails.startDate",
            formatDateForInput(contestData.start_date)
          );
          setValue(
            "basicDetails.endDate",
            formatDateForInput(contestData.end_date)
          );

          // Store contest name for header
          setContestName(contestData.name || "Untitled Contest");

          // Actions
          setValue("actions.rewardType", contestData.reward_type || "");
          setValue("actions.chooseReward", contestData.reward_option || "");

          // Post Capture
          setValue(
            "postCapture.behaviour",
            contestData.capture_behaviour || ""
          );
          setValue(
            "postCapture.autoclose",
            contestData.capture_autoclose || ""
          );
          setValue("postCapture.title", contestData.post_capture_content || "");
          setValue("postCapture.description", "");
          setValue("postCapture.url", "");
          
          // Load post contest data
          setValue("postContest.content", contestData.end_contest || "");

          // Targeting
          if (
            contestData.audience_segments &&
            contestData.audience_segments.length > 0
          ) {
            setValue(
              "targeting.audienceSegment",
              contestData.audience_segments[0] || ""
            );
          }

          // If contest has a form schema, load it
          if (contestData.form_schema_id) {
            setSavedDbFormId(contestData.form_schema_id);
            await loadFormSchemaFromDb();
          }
        }
      } catch (error) {
        console.error("Error loading contest:", error);
        alert("Failed to load contest data. Please try again.");
      } finally {
        setIsLoadingContest(false);
      }
    };

    loadContestData();
  }, [contestId, setValue, fetchContest]);

  // Debounced form builder update for better performance
  const debouncedSetFormBuilder = useMemo(
    () =>
      debounce((data) => {
        setValue("formBuilder", data);
      }, 300),
    [setValue]
  );

  // Load form schema from database
  const loadFormSchemaFromDb = useCallback(async () => {
    if (!savedDbFormId) {
      console.log("No saved form ID to load");
      return;
    }

    try {
      setIsLoadingForm(true);
      console.log("Loading form schema from database:", savedDbFormId);

      const formData = await fetchFormSchemaById(savedDbFormId);

      if (formData) {
        console.log("Form schema loaded successfully:", formData);
        // Update the form builder data with fetched schema
        setValue("formBuilder", {
          formId: formData.formId,
          formTitle: formData.formTitle,
          formDescription: formData.formDescription,
          fields: formData.fields,
          containers: formData.containers,
          design: formData.design,
        });
      } else {
        console.error("Failed to load form schema");
      }
    } catch (error) {
      console.error("Error loading form schema:", error);
    } finally {
      setIsLoadingForm(false);
    }
  }, [savedDbFormId, fetchFormSchemaById, setValue]);

  // Save or update form schema to database
  const saveFormSchema = async () => {
    try {
      setIsSavingForm(true);
      const formBuilderData = getValues("formBuilder");
      const { formTitle, formDescription, fields, containers, design } =
        formBuilderData;

      const schema = {
        title: formTitle,
        description: formDescription,
        fields,
        containers,
        design,
      };

      let dbFormId: string;
      let embedId: string;

      // Check if we're updating an existing form schema
      if (savedDbFormId) {
        // UPDATE existing form schema using API hook
        console.log("Updating existing form schema:", savedDbFormId);

        const data = await updateFormSchema(savedDbFormId, {
          title: formTitle,
          description: formDescription,
          fields: fields,
          containers: containers,
          design: design,
        });

        embedId = data.form_id;
        dbFormId = data.id;
        console.log("Form updated successfully:", data);
      } else {
        // CREATE new form schema using API hook
        embedId = generateFormId();

        const data = await createFormSchema({
          form_id: embedId,
          contest_id: contestId,
          title: formTitle,
          description: formDescription,
          fields: fields,
          containers: containers,
          design: design,
        });

        dbFormId = data.id;
        console.log("Form created successfully:", data);

        // Update contest record with form_schema_id using API hook
        if (contestId) {
          await updateContest(contestId, { form_schema_id: dbFormId });
        }
      }

      setSavedFormId(embedId); // Embed ID for display
      setSavedDbFormId(dbFormId); // Database ID for fetching
      setValue("formBuilder.formId", dbFormId);

      return dbFormId;
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Error saving form to database. Please try again.");
      return null;
    } finally {
      setIsSavingForm(false);
    }
  };

  // Handle step navigation with validation
  const handleStepSubmit = async (step: number) => {
    try {
      let isValid = false;
      let savedContest = null;

      switch (step) {
        case 0: // Basic Details
          isValid = await form.trigger("basicDetails");
          if (isValid) {
            const basicDetails = getValues("basicDetails");
            savedContest = await saveContestData(
              {
                name: basicDetails.name,
                contest_type: basicDetails.contestType,
                start_date: basicDetails.startDate,
                end_date: basicDetails.endDate,
              },
              "basicDetails"
            );

            if (savedContest) {
              setCurrentStep(1);
            }
          }
          break;

        case 1: // Form Builder - Save to database before proceeding
          console.log("Form Builder data:", getValues("formBuilder"));
          const formId = await saveFormSchema();
          if (formId) {
            setCurrentStep(2);
          }
          break;

        case 2: // Actions
          isValid = await form.trigger("actions");
          if (isValid) {
            const actions = getValues("actions");
            savedContest = await saveContestData(
              {
                reward_type: actions.rewardType,
                reward_option: actions.chooseReward,
              },
              "actions"
            );

            if (savedContest) {
              console.log("Actions validated and saved:", actions);
              setCurrentStep(3);
            }
          }
          break;

        case 3: // Post Capture
          isValid = await form.trigger("postCapture");
          if (isValid) {
            const postCapture = getValues("postCapture");
            savedContest = await saveContestData(
              {
                capture_behaviour: postCapture.behaviour,
                capture_autoclose: postCapture.autoclose,
                post_capture_content: postCapture.title, // Store markdown content in post_capture_content
              },
              "postCapture"
            );

            if (savedContest) {
              console.log("Post Capture validated and saved:", postCapture);
              setCurrentStep(4);
            }
          }
          break;

        case 4: // Post Contest (optional)
          // No validation needed as it's optional
          const postContest = getValues("postContest");
          // Only save if content is provided
          if (postContest.content && postContest.content.trim() !== "") {
            savedContest = await saveContestData(
              {
                end_contest: postContest.content, // Store markdown content in end_contest
              },
              "postContest"
            );
          }
          // Move to next step regardless of whether content was provided
          setCurrentStep(5);
          break;

        case 5: // Targeting
          isValid = await form.trigger("targeting");
          if (isValid) {
            const targeting = getValues("targeting");
            savedContest = await saveContestData(
              {
                audience_segments: [targeting.audienceSegment], // Save as array
                status: "active", // Mark as active when completing all steps
              },
              "targeting"
            );

            if (savedContest) {
              console.log("Targeting validated and saved:", targeting);
              setCurrentStep(6); // Move to Share step
            }
          }
          break;

        case 6: // Share - Final step
          await handleFinalSubmit();
          break;
      }
    } catch (error) {
      console.error("Error in handleStepSubmit:", error);
      // alert(`Failed to save data: ${error.message}`);
    }
  };
  const saveContestData = async (stepData: any, step: string) => {
    try {
      const url = contestId ? `/api/contests/${contestId}` : "/api/contests";

      const method = contestId ? "PUT" : "POST";

      // Prepare the data to be saved based on the current step
      let updateData: any = {
        ...stepData,
        // For new contests, set initial status
        ...(!contestId && { status: "draft" }),
      };

      // If this is the final step, update the status to active
      if (step === "targeting") {
        updateData.status = "active";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save contest data");
      }

      const { data } = await response.json();

      // If this was a new contest, update the URL with the new ID
      if (!contestId && data?.id) {
        window.history.pushState({}, "", `/contests/${data.id}/create`);
      }

      return data;
    } catch (error) {
      console.error(`Error saving ${step} data:`, error);
      throw error;
    }
  };

  // Final submission - redirect to contests list
  const handleFinalSubmit = async () => {
    const allData = getValues();
    console.log("Contest creation completed!");
    console.log("All form data:", allData);

    // All data has been saved incrementally at each step
    // Redirect to contests list
    router.push("/contests");
  };

  const handlePrevious = async () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;

      // If going back to form builder step (step 1) and we have a saved form, load it from DB
      if (newStep === 1 && savedDbFormId) {
        await loadFormSchemaFromDb();
      }

      setCurrentStep(newStep);
    }
  };

  const handleNext = async () => {
    await handleStepSubmit(currentStep);
  };

  const handleCancel = () => {
    router.push("/contests");
  };

  const breadcrumbItems = [
    {
      label: "Contests",
      href: "/contests",
      icon: <Ticket className="w-6 h-6 text-[#141C25]" />,
    },
  ];

  // Show loading screen while contest data is being loaded
  if (isLoadingContest) {
    return <FormLoading />;
  }

  return (
    <FormProvider {...form}>
      <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between md:items-center px-4 lg:px-6 py-4 lg:py-5 border-b border-[#E4E7EC] flex-shrink-0">
          {/* Top row on mobile: Breadcrumb and Action Buttons */}
          <div className="flex justify-between items-center md:contents min-w-0">
            {/* Breadcrumb with Back Button */}
            <div className="flex items-center gap-3 flex-shrink-0 min-w-0 overflow-hidden">
              <button
                onClick={handleCancel}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#E4E7EC] hover:bg-[#F9FAFB] transition-colors flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-[#637083]" />
              </button>
              <div className="min-w-0 overflow-hidden">
                <Breadcrumb items={breadcrumbItems} />
              </div>
              {(contestName || watchedContestName) && (
                <span className="text-sm text-[#637083] font-medium truncate">
                  ({contestName || watchedContestName})
                </span>
              )}
            </div>

            {/* Action Buttons - shown on mobile in top row */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 md:order-3">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={cn(
                  "flex px-2 md:px-3 lg:px-4 py-2 justify-center items-center gap-2 rounded border transition-colors text-xs lg:text-sm font-medium",
                  currentStep === 0
                    ? "border-[#E4E7EC] text-[#97A1AF] cursor-not-allowed"
                    : "border-[#005EB8] text-[#005EB8] hover:bg-[#005EB8] hover:text-white"
                )}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={isSavingForm}
                className={cn(
                  "flex px-2 md:px-3 lg:px-4 py-2 justify-center items-center gap-2 rounded transition-colors text-xs lg:text-sm font-medium text-white",
                  isSavingForm
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#005EB8] hover:bg-[#004A94]"
                )}
              >
                {isSavingForm
                  ? "Saving..."
                  : currentStep === 6
                  ? "View Contests"
                  : currentStep === 5
                  ? "Finish"
                  : "Next Step"}
              </button>
            </div>
          </div>

          {/* Stepper - centered on mobile (bottom row), centered between breadcrumb and buttons on desktop */}
          <div className="flex justify-center md:flex-1 md:px-4 md:order-2 min-w-0 overflow-x-auto">
            <div className="min-w-max">
              <Stepper steps={steps} currentStep={currentStep} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={cn(
            "flex-1 flex gap-4 lg:gap-6 min-h-0",
            currentStep === 1
              ? "flex-col p-0"
              : "flex-col lg:flex-row p-4 lg:p-6"
          )}
        >
          {/* Form Section - Full width on form builder step (step 1), reduced width on other steps with preview */}
          <div
            className={cn(
              "flex-1 min-h-0",
              currentStep === 1 ? "w-full" : "lg:flex-[0.55]"
            )}
          >
            {/* Step 1: Basic Details */}
            {currentStep === 0 && (
              <div ref={formRef} className="h-full">
                <BasicDetailsForm
                  control={form.control}
                  fieldPrefix="basicDetails"
                />
              </div>
            )}

            {/* Step 2: Create Form */}
            {currentStep === 1 && (
              <div ref={formRef} className="h-full w-full">
                {isLoadingForm ? (
                  <FormLoading />
                ) : (
                  <Suspense fallback={<FormLoading />}>
                    <ContestFormBuilder
                      onDataChange={debouncedSetFormBuilder}
                      defaultValues={formBuilderData}
                    />
                  </Suspense>
                )}
              </div>
            )}

            {/* Step 3: Actions */}
            {currentStep === 2 && (
              <div ref={formRef} className="h-full space-y-4">
                <Suspense fallback={<FormLoading />}>
                  <ActionsForm control={form.control} fieldPrefix="actions" />
                </Suspense>
              </div>
            )}

            {/* Step 4: Post Capture */}
            {currentStep === 3 && (
              <div ref={formRef} className="h-full">
                <Suspense fallback={<FormLoading />}>
                  <PostCaptureForm
                    control={form.control}
                    fieldPrefix="postCapture"
                  />
                </Suspense>
              </div>
            )}

            {/* Step 5: Post Contest */}
            {currentStep === 4 && (
              <div ref={formRef} className="h-full">
                <Suspense fallback={<FormLoading />}>
                  <PostContestForm
                    control={form.control}
                    fieldPrefix="postContest"
                    endDate={endDate}
                  />
                </Suspense>
              </div>
            )}

            {/* Step 6: Targeting */}
            {currentStep === 5 && (
              <div ref={formRef} className="h-full">
                <Suspense fallback={<FormLoading />}>
                  <TargetingForm
                    control={form.control}
                    fieldPrefix="targeting"
                  />
                </Suspense>
              </div>
            )}

            {/* Step 7: Share - Show embed code */}
            {currentStep === 6 && (
              <div ref={formRef} className="h-full flex flex-col">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#141C25]">
                      🎉 Contest Created Successfully!
                    </h2>
                    <p className="text-sm text-[#637083] mt-1">
                      Your contest has been created and is ready to share
                    </p>
                  </div>
                  <EmbedCodeSection embedId={savedFormId} />
                </div>
              </div>
            )}
          </div>

          {/* Preview Section - Hidden on form builder step (step 1) */}
          {currentStep !== 1 && (
            <div className="lg:flex-[0.45] min-h-0">
              {currentStep === 3 ? (
                // Show Post Capture Preview on step 3 (Post Capture)
                <PostCapturePreview
                  title={postCaptureData.title}
                  description={postCaptureData.description}
                  url={postCaptureData.url}
                />
              ) : currentStep === 4 ? (
                // Show Post Contest Preview on step 4 (After Contest Ends)
                <PostContestPreview
                  content={postContestData.content}
                />
              ) : (
                // Show SVG placeholder on all other steps (0, 2, 5, 6)
                <ContestPreview
                  formData={null}
                  currentStep={currentStep}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
};
