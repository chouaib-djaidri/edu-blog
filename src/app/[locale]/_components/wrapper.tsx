"use client";
import { useEffect, useRef, useState } from "react";
import { scroller } from "react-scroll";

import Navbar, { tabs } from "@/components/layout/landing-navbar";
import { HeroSection } from "./hero-section";
import BlogsSection from "./blogs-section";

const getCurrentSection = (selected: number) => {
  const viewportThreshold = 100;
  for (let i = 0; i < tabs.length; i++) {
    const section = document.getElementById(tabs[i].sectionId);
    if (!section) continue;
    const rect = section.getBoundingClientRect();
    if (rect.top <= viewportThreshold && rect.bottom > viewportThreshold) {
      return i;
    }
  }
  if (window.scrollY < 100) {
    return 0;
  }
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    return tabs.length - 1;
  }
  return selected;
};

const Wrapper = () => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selected, setSelected] = useState<number>(0);
  const [isScrollingProgrammatically, setIsScrollingProgrammatically] =
    useState(false);

  const handleSelect = (index: number) => {
    setSelected(index);
    setIsScrollingProgrammatically(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scroller.scrollTo(tabs[index].sectionId, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -86,
    });
    setTimeout(() => {
      setIsScrollingProgrammatically(false);
    }, 900);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingProgrammatically) return;
      const currentSectionIndex = getCurrentSection(selected);
      if (currentSectionIndex !== selected) {
        setSelected(currentSectionIndex);
      }
    };
    window.addEventListener("scroll", handleScroll);
    const initialCheck = setTimeout(() => {
      if (!isScrollingProgrammatically) {
        const currentSectionIndex = getCurrentSection(selected);
        if (currentSectionIndex !== selected) {
          setSelected(currentSectionIndex);
        }
      }
    }, 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(scrollTimeoutRef.current);
      }
      clearTimeout(initialCheck);
    };
  }, [isScrollingProgrammatically, selected]);
  return (
    <>
      <Navbar selected={selected} handleSelect={handleSelect} />
      <div>
        <HeroSection handleSelect={handleSelect} />
        <BlogsSection />
        {/* <FeaturesSection /> */}
        {/* <TestimonialsSection /> */}
        {/* <NewsletterSection /> */}
        {/* <FaqSection /> */}
        {/* <ContactSection /> */}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Wrapper;
