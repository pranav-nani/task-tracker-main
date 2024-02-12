import { useState, useEffect, useRef } from "react";
import { Box, Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import { Sidebar } from "./components/Sidebar";
import { MobileHeader } from "./components/MobileHeader";
import { Tasks } from "./pages/Tasks";
import { Board } from "./pages/Board";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile] = useMediaQuery("(max-width: 992px)");
  const [activeBoardId, setActiveBoardId] = useState<string>("");
  const mainRef = useRef<HTMLDivElement>(null);

  function setMainWidth() {
    if (mainRef.current) {
      const sidebarWidth =
        mainRef.current.previousElementSibling?.clientWidth || 0;
      mainRef.current.style.width = `calc(100% - ${sidebarWidth}px)`;
    }
  }

  useEffect(() => {
    setMainWidth();
    window.addEventListener("resize", setMainWidth);
    setIsLoading(false);
    return () => window.removeEventListener("resize", setMainWidth);
  }, [isMobile]);

  return (
    <Flex
      bgColor="gray.700"
      h="100dvh"
      w="100vw"
      position={isMobile ? "relative" : "fixed"}
      direction={["column", null, null, "row"]}
    >
      {isLoading ? (
        <Box width="100%" textAlign="center" mt={12}>
          <Spinner />
        </Box>
      ) : (
        <>
          {isMobile ? (
            <MobileHeader />
          ) : (
            <Sidebar setActiveBoard={setActiveBoardId} />
          )}
          {activeBoardId ? (
            <Board
              isMobile={isMobile}
              id={activeBoardId}
              setActiveBoard={setActiveBoardId}
            />
          ) : (
            <Tasks mainRef={mainRef} isMobile={isMobile} />
          )}
        </>
      )}
    </Flex>
  );
}

export default App;
