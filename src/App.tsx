import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import { portfolioData } from "./data/portfolioData";

const App = () => {
  useEffect(() => {
    document.title = portfolioData.site.title;
  }, []);

  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
      <Analytics />
    </>
  );
};

export default App;
