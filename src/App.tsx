import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import WhyUs from "./components/WhyUs";
import Partners from "./components/Partners";
import DeveloperPartners from "./components/DeveloperPartners";
import ContactForm from "./components/ContactForm";
import LeadDashboard from "./components/LeadDashboard";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";
import AdminAuth from "./components/AdminAuth";
import UnitsManager from "./components/UnitsManager";
import UnitsPage from "./components/UnitsPage";
import FounderModal from "./components/FounderModal";
import BuyerIntake from "./components/BuyerIntake";
import SellPropertyForm from "./components/SellPropertyForm";
import DeveloperPartnerForm from "./components/DeveloperPartnerForm";
import SubmitProjectModal, { PROJECT_SUBMISSIONS_KEY } from "./components/SubmitProjectModal";
import ProjectApprovalsManager from "./components/ProjectApprovalsManager";
import { LeadSubmission } from "./types";

export default function App() {
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showFounder, setShowFounder] = useState(false);
  const [showUnitsManager, setShowUnitsManager] = useState(false);
  const [showBuyerIntake, setShowBuyerIntake] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [showDeveloperForm, setShowDeveloperForm] = useState(false);
  const [showSubmitProject, setShowSubmitProject] = useState(false);
  const [showProjectApprovals, setShowProjectApprovals] = useState(false);
  const [pendingProjectsCount, setPendingProjectsCount] = useState(0);

  const refreshPendingProjectsCount = () => {
    try {
      const raw = localStorage.getItem(PROJECT_SUBMISSIONS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setPendingProjectsCount(list.filter((s: any) => s.status === "pending").length);
    } catch { setPendingProjectsCount(0); }
  };

  useEffect(() => {
    refreshPendingProjectsCount();
  }, [showUnitsManager, showProjectApprovals, showSubmitProject]);

  // Units page navigation state
  const [unitsOpen, setUnitsOpen] = useState(false);
  const [unitsInitialType, setUnitsInitialType] = useState("All");

  const handleNavigate = (type: string) => {
    setUnitsInitialType(type);
    setUnitsOpen(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Scroll to top on page load + clear admin auth on every page load/refresh
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    sessionStorage.removeItem("lavida_admin_auth");
  }, []);

  // Keyboard shortcut: Ctrl + Shift + A → open units admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        const isAuth = sessionStorage.getItem("lavida_admin_auth") === "true";
        if (isAuth) {
          setShowUnitsManager(true);
        } else {
          setShowAdminAuth(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load leads from localStorage on initial render
  useEffect(() => {
    const savedLeads = localStorage.getItem("lavida_leads_list");
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        console.error("Failed to parse saved leads", e);
      }
    }
  }, []);

  const saveLeadsToStorage = (updatedLeads: LeadSubmission[]) => {
    setLeads(updatedLeads);
    localStorage.setItem("lavida_leads_list", JSON.stringify(updatedLeads));
  };

  const handleLeadSubmit = (newLeadData: Omit<LeadSubmission, "id" | "date" | "status">) => {
    const newLead: LeadSubmission = {
      ...newLeadData,
      id: "lead_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      status: "new"
    };

    const updatedLeads = [newLead, ...leads];
    saveLeadsToStorage(updatedLeads);
  };

  const handleUpdateStatus = (id: string, status: LeadSubmission["status"]) => {
    const updatedLeads = leads.map((lead) => 
      lead.id === id ? { ...lead, status } : lead
    );
    saveLeadsToStorage(updatedLeads);
  };

  const handleDeleteLead = (id: string) => {
    const updatedLeads = leads.filter((lead) => lead.id !== id);
    saveLeadsToStorage(updatedLeads);
  };

  const handleClearAllLeads = () => {
    saveLeadsToStorage([]);
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased select-none font-sans relative">
      
      {/* ── Units Page (navigated from Projects section) ─────────────────── */}
      {unitsOpen && (
        <div className="fixed inset-0 z-[60] bg-surface overflow-y-auto">
          <UnitsPage
            initialType={unitsInitialType}
            onBack={() => { setUnitsOpen(false); window.scrollTo({ top: 0, behavior: "instant" }); }}
          />
        </div>
      )}

      {/* 1. Dynamic Header Navigation */}
      <Header
        onAdminToggle={() => setShowAdminPortal(!showAdminPortal)}
        showAdminPortal={showAdminPortal}
      />

      {/* 2. Hero Interactive Gateway */}
      <Hero
        onCtaclick={handleScrollTo}
        onOpenBuyerIntake={() => setShowBuyerIntake(true)}
        onOpenSellForm={() => setShowSellForm(true)}
        onOpenDeveloperForm={() => setShowDeveloperForm(true)}
      />

      {/* 3. About Corporate Section with counter metrics */}
      <About />

      {/* 4. Custom Selected Properties with detail modulators */}
      <Projects onNavigate={handleNavigate} />

      {/* 5. Complete Services Modular Interactive Block */}
      {/* Temporarily hidden - remove this comment wrapper to re-enable */}
      {/* <Services /> */}

      {/* 7. WhyUs Bento Grid Design with material-equivalent styling */}
      {/* Temporarily hidden - remove this comment wrapper to re-enable */}
      {/* <WhyUs /> */}

      {/* 7b. Our Partners */}
      {/* Temporarily hidden - remove this comment wrapper to re-enable */}
      {/* <Partners /> */}

      {/* 7c. Approved Developer Partners (public, populated after admin approval) */}
      <DeveloperPartners />

      {/* 8. Conversion lead generation module */}
      <ContactForm onLeadSubmit={handleLeadSubmit} />

      {/* 9. Floating Whatsapp Interaction Widget */}
      <WhatsAppButton />

      {/* 10. Footer info links */}
      <Footer
        onScrollTo={handleScrollTo}
        onOpenFounder={() => setShowFounder(true)}
        onOpenSubmitProject={() => setShowSubmitProject(true)}
        onOpenAdmin={() => {
          const isAuth = sessionStorage.getItem("lavida_admin_auth") === "true";
          if (isAuth) { setShowUnitsManager(true); }
          else { setShowAdminAuth(true); }
        }}
      />

      {/* 11. Admin Leads Dashboard controller */}
      <LeadDashboard
        leads={leads}
        isOpen={showAdminPortal}
        onClose={() => setShowAdminPortal(false)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteLead={handleDeleteLead}
        onClearAll={handleClearAllLeads}
      />

      {/* 12. Admin Auth Modal (Ctrl+Shift+A) */}
      <AdminAuth
        isOpen={showAdminAuth}
        onClose={() => setShowAdminAuth(false)}
        onSuccess={() => { setShowAdminAuth(false); setShowUnitsManager(true); }}
      />

      {/* 13. Units Manager Panel */}
      <UnitsManager
        isOpen={showUnitsManager}
        onClose={() => setShowUnitsManager(false)}
        onOpenProjectApprovals={() => setShowProjectApprovals(true)}
        pendingProjectsCount={pendingProjectsCount}
      />

      {/* 14. Founder Modal */}
      <FounderModal
        isOpen={showFounder}
        onClose={() => setShowFounder(false)}
      />

      {/* 15. Buyer Property Matching Intake */}
      <BuyerIntake
        isOpen={showBuyerIntake}
        onClose={() => setShowBuyerIntake(false)}
      />

      {/* 16. Sell Your Property Lead Funnel */}
      <SellPropertyForm
        isOpen={showSellForm}
        onClose={() => setShowSellForm(false)}
      />

      {/* 17. Developer Partnership Lead Form */}
      <DeveloperPartnerForm
        isOpen={showDeveloperForm}
        onClose={() => setShowDeveloperForm(false)}
      />

      {/* 18. Developer Project Submission Modal (public) */}
      <SubmitProjectModal
        isOpen={showSubmitProject}
        onClose={() => setShowSubmitProject(false)}
      />

      {/* 19. Admin: Project Approvals Panel */}
      <ProjectApprovalsManager
        isOpen={showProjectApprovals}
        onClose={() => setShowProjectApprovals(false)}
      />

    </div>
  );
}
