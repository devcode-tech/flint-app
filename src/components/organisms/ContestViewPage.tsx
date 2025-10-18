"use client";

import React, { useState, useEffect } from "react";
import { Edit, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/molecules/Breadcrumb";
import { ShareCampaign } from "@/components/organisms/ShareCampaign";
import { EmbedCodeSection } from "./EmbedCodeSection";
import { LeadsTable } from "@/components/organisms/LeadsTable";
import { AnalyticsView } from "@/components/organisms/AnalyticsView";
import { PickWinnersView } from "@/components/organisms/PickWinnersView";
import { cn } from "@/lib/utils";
import { useContestApi } from "@/hooks/useContestApi";
import { useFormSchema } from "@/hooks/useFormSchema";
import type { Contest } from "@/types/contest";
import type { FormBuilderData } from "@/hooks/useFormSchema";
import { FormPreviewLive } from "@devcode-tech/form-builder";
import { ContestPreview } from "@/components/organisms/ContestPreview";

interface ContestViewPageProps {
  contestId?: string;
  className?: string;
}

const tabs = [
  { id: "preview", label: "Preview" },
  { id: "leads", label: "Leads" },
  { id: "analytics", label: "Analytics" },
  { id: "pick-winners", label: "Pick Winners" },
];

export const ContestViewPage: React.FC<ContestViewPageProps> = ({
  contestId = "AR-24612474-53",
  className,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("preview");
  const [contest, setContest] = useState<Contest | null>(null);
  const [formData, setFormData] = useState<FormBuilderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { fetchContest, updateContest } = useContestApi();
  const { fetchFormSchemaById } = useFormSchema();
  const embedId = formData?.embedId;

  const handleToggleStatus = async () => {
    if (!contest) return;
    
    try {
      setIsUpdatingStatus(true);
      const newStatus = contest.status === 'active' ? 'draft' : 'active';
      
      await updateContest(contestId, { status: newStatus });
      
      // Update local state
      setContest({ ...contest, status: newStatus });
    } catch (error) {
      console.error('Error updating contest status:', error);
      alert('Failed to update contest status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Load contest and form data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch contest
        const contestData = await fetchContest(contestId);
        setContest(contestData);

        // Fetch form schema if exists
        if (contestData.form_schema_id) {
          const form = await fetchFormSchemaById(contestData.form_schema_id);
          if (form) {
            setFormData(form);
          }
        }
      } catch (error) {
        console.error("Error loading contest data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [contestId, fetchContest, fetchFormSchemaById]);

  const breadcrumbItems = [
    { label: "Contests", href: "/contests" },
    { label: contest?.name || contestId, href: `/contests/${contestId}` },
  ];

  const handleEditClick = () => {
    router.push(`/contests/${contestId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#E4E7EC] border-t-[#005EB8] rounded-full animate-spin" />
          <p className="text-sm text-[#637083]">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#637083]">Contest not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="bg-white border-b border-[#E4E7EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-6 lg:px-8 py-5">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-3">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#005EB8] text-[#005EB8] rounded-lg hover:bg-[#005EB8] hover:text-white transition-all duration-200 font-medium text-sm"
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
            {contest.status === "active" ? (
              <button 
                onClick={handleToggleStatus}
                disabled={isUpdatingStatus}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 bg-[#005EB8] text-white rounded-lg hover:bg-[#004A94] transition-all duration-200 font-medium text-sm shadow-sm",
                  isUpdatingStatus && "opacity-50 cursor-not-allowed"
                )}
              >
                <Pause size={18} />
                <span>{isUpdatingStatus ? 'Pausing...' : 'Pause'}</span>
              </button>
            ) : (
              <button 
                onClick={handleToggleStatus}
                disabled={isUpdatingStatus}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] transition-all duration-200 font-medium text-sm shadow-sm",
                  isUpdatingStatus && "opacity-50 cursor-not-allowed"
                )}
              >
                <Play size={18} />
                <span>{isUpdatingStatus ? 'Activating...' : 'Activate'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {contest.status === "active" && (
        <div className="bg-[#E4FFF5] border-b border-[#E4E7EC]">
          <div className="flex justify-center items-center py-2">
            <span className="text-[#0C8053] font-medium text-sm">
              This contest is Active
            </span>
          </div>
        </div>
      )}
      {contest.status === "draft" && (
        <div className="bg-[#FFF4E6] border-b border-[#E4E7EC]">
          <div className="flex justify-center items-center py-2">
            <span className="text-[#B54708] font-medium text-sm">
              This contest is in Draft
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 bg-[#F9FAFB]">
        <div className="px-6 lg:px-8 py-6">
          {/* Tabs */}
          <div className="flex border-b border-[#E4E7EC] mb-6 bg-white rounded-t-xl px-6 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 relative",
                  activeTab === tab.id
                    ? "text-[#005EB8] border-[#005EB8]"
                    : "text-[#637083] border-transparent hover:text-[#141C25] hover:border-[#E4E7EC]"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#005EB8] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-[#E4E7EC] min-h-[600px]">
            {activeTab === "preview" ? (
              <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[600px]">
                {/* Left Panel - Share Campaign */}
                <div className="w-full lg:w-[430px] flex flex-col gap-6 lg:flex-shrink-0">
                  {/* Embed Code Section */}
                  <EmbedCodeSection embedId={embedId} />
                  <ShareCampaign
                    contestUrl={`https://example.com/contest/${contestId}`}
                    contestName={contest.name}
                  />
                </div>

                {/* Right Panel - Contest Preview */}
                <div className="flex-1 min-w-0">
                  <ContestPreviewPanel formData={formData} contest={contest} />
                </div>
              </div>
            ) : activeTab === "leads" ? (
              <div className="p-6">
                <LeadsTable />
              </div>
            ) : activeTab === "analytics" ? (
              <div className="p-6">
                <AnalyticsView />
              </div>
            ) : activeTab === "pick-winners" ? (
              <div className="p-6">
                <PickWinnersView />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-[#637083]">
                <p className="text-center">
                  Content for {tabs.find((tab) => tab.id === activeTab)?.label}{" "}
                  tab coming soon...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Contest Preview Panel Component
interface ContestPreviewPanelProps {
  formData: FormBuilderData | null;
  contest: Contest;
}

const ContestPreviewPanel: React.FC<ContestPreviewPanelProps> = ({
  formData,
  contest,
}) => {
  const hasForm = formData && formData.fields && formData.fields.length > 0;

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Contest Preview */}
      <div className="flex-1 border border-[#E4E7EC] rounded-xl bg-white shadow-sm overflow-auto">
        {hasForm ? (
          // Use FormPreviewLive from form-builder library
          <div className="p-6">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-[#141C25] mb-2">
                {contest.name}
              </h3>
              <p className="text-sm text-[#637083]">Contest Preview</p>
            </div>
            <FormPreviewLive
              fields={formData.fields}
              containers={formData.containers || []}
              formTitle={formData.formTitle || contest.name}
              formDescription={
                formData.formDescription ||
                "Enter the contest by filling out the form below"
              }
              formDesign={formData.design || {}}
            />
          </div>
        ) : (
          // Use ContestPreview component for default preview
          <ContestPreview formData={null} currentStep={0} />
        )}
      </div>
    </div>
  );
};

export default ContestViewPage;
