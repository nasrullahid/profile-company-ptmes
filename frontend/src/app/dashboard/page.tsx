"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Solutions from "./Solutions";
import Why from "./Why";
import How from "./How";
import Jangkauan from "./Jangkauan";
import Footer from "./Footer";

function Page() {
  const [activeSection, setActiveSection] = useState("beranda");

  const renderSection = () => {
    switch (activeSection) {
      case "beranda":
        return <Home />;
      case "tentang-kami":
        return <About />;
      case "solusi":
        return <Solutions />;
      case "mengapa-kami":
        return <Why />;
      case "cara-kerja":
        return <How />;
      case "jangkauan":
        return <Jangkauan />;
      default:
        return <Home />;
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Dynamic Content */}
      <div className="transition-all duration-300">{renderSection()}</div>

      <Footer />
    </main>
  );
}

export default Page;
