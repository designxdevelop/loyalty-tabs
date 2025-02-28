document.addEventListener("DOMContentLoaded", function () {
  // Get all tabs
  const tabs = document.querySelectorAll(".stack-tab");

  // Animation configuration based on the provided timing function and speed
  const animConfig = {
    duration: 0.3, // 300ms as specified in your requirements
    ease: "cubic-bezier(0.64, 0.04, 0.35, 1)", // Exact timing function from your requirements
  };

  // Initialize the active tab's content height
  const initialActiveContent = document.querySelector(".stack-tab.active .stack-tab-content.active");
  if (initialActiveContent) {
    // Make sure the active content has height: auto and is visible
    initialActiveContent.style.height = "auto";
    initialActiveContent.style.opacity = "1";
    initialActiveContent.style.overflow = "visible";
  }

  // Add click event listener to each tab
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // If the clicked tab is already active, do nothing
      if (tab.classList.contains("active")) return;

      // Find the currently active tab
      const activeTab = document.querySelector(".stack-tab.active");

      // Create a master timeline for the entire transition
      const masterTl = gsap.timeline({
        defaults: {
          ease: animConfig.ease,
        },
      });

      // Deactivate the current active tab with animation
      if (activeTab) {
        const activeContent = activeTab.querySelector(".stack-tab-content.active");
        const activeTitleRow = activeTab.querySelector(".stack-tab-title-row.active");
        const activeNum = activeTab.querySelector(".stack-tab-num.active");
        const activeTitle = activeTab.querySelector(".stack-tab-title.active");

        // Get the current height before animation
        const currentHeight = activeContent.offsetHeight;

        // Create a timeline for the outgoing animation
        const tlOut = gsap.timeline();

        // Set the explicit height before animating
        tlOut.set(activeContent, {
          height: currentHeight,
          overflow: "hidden",
        });

        // Fade out content with a smooth transition
        tlOut.to(activeContent, {
          opacity: 0,
          duration: animConfig.duration * 0.4,
          ease: "power1.out",
        });

        // Then collapse the height
        tlOut.to(
          activeContent,
          {
            height: 0,
            marginTop: 0,
            duration: animConfig.duration * 0.6,
          },
          "-=0.1"
        ); // Slight overlap for smoother transition

        // Animate font-weight changes for title and number
        tlOut.to(
          [activeTitle, activeNum],
          {
            fontWeight: 400, // Normal weight
            duration: animConfig.duration * 0.5,
          },
          0 // Start at the beginning of the timeline
        );

        // Add to master timeline
        masterTl.add(tlOut);

        // Remove active classes after animation completes
        masterTl.call(() => {
          activeTab.classList.remove("active");
          activeTitleRow.classList.remove("active");
          activeNum.classList.remove("active");
          activeTitle.classList.remove("active");
          activeContent.classList.remove("active");

          // Reset any inline styles
          gsap.set(activeContent, { clearProps: "all" });
          gsap.set(activeTitle, { clearProps: "fontWeight" });
          gsap.set(activeNum, { clearProps: "fontWeight" });
        });
      }

      // Activate the clicked tab with animation
      const tabContent = tab.querySelector(".stack-tab-content");
      const tabTitleRow = tab.querySelector(".stack-tab-title-row");
      const tabNum = tab.querySelector(".stack-tab-num");
      const tabTitle = tab.querySelector(".stack-tab-title");

      // Create a timeline for the incoming animation
      const tlIn = gsap.timeline();

      // Prepare the tab for animation - add active classes first
      masterTl.call(() => {
        // Add active classes
        tab.classList.add("active");
        tabTitleRow.classList.add("active");
        tabNum.classList.add("active");
        tabTitle.classList.add("active");
        tabContent.classList.add("active");

        // Set initial state for animation - content hidden but will appear all at once
        gsap.set(tabContent, {
          height: 0,
          opacity: 0,
          scale: 0.98,
          transformOrigin: "top center",
          marginTop: 0,
          overflow: "hidden",
        });

        // Set initial font-weight
        gsap.set([tabTitle, tabNum], { fontWeight: 400 });
      });

      // Get the natural height without affecting layout
      masterTl.call(() => {
        // Create a temporary container to measure the content height accurately
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.visibility = "hidden";
        tempDiv.style.display = "block";
        tempDiv.style.width = tabContent.offsetWidth + "px";
        document.body.appendChild(tempDiv);

        // Clone the content into the temp container
        const clone = tabContent.cloneNode(true);
        clone.style.height = "auto";
        clone.style.opacity = "1";
        clone.style.marginTop = "0.75rem";
        clone.style.padding = window.getComputedStyle(tabContent).padding;
        clone.style.boxSizing = "border-box";
        tempDiv.appendChild(clone);

        // Measure the exact height
        const autoHeight = clone.offsetHeight;

        // Clean up
        document.body.removeChild(tempDiv);

        // First expand the height with content still hidden
        tlIn.to(tabContent, {
          height: autoHeight,
          marginTop: "0.75rem",
          duration: animConfig.duration * 0.6,
        });

        // Smoothly fade in content with scale
        tlIn.to(
          tabContent,
          {
            opacity: 1,
            scale: 1,
            duration: animConfig.duration * 0.5,
            ease: "power2.out",
          },
          "-=0.2" // Start before height animation completes for smoother overlap
        );

        // Animate font-weight changes
        tlIn.to(
          [tabTitle, tabNum],
          {
            fontWeight: 600,
            duration: animConfig.duration * 0.5,
          },
          0 // Start at the beginning of the timeline
        );

        // Final cleanup after animation
        tlIn.call(() => {
          gsap.set(tabContent, {
            height: "auto",
            overflow: "visible",
            clearProps: "scale,transformOrigin", // Clear scale properties
          });
        });
      });

      // Add to master timeline
      masterTl.add(tlIn);
    });
  });
});
