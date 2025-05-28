import { useState } from "react";
import { useSearchParams, useNavigate } from "@remix-run/react";
import { ClientOnly } from "../components/ClientOnly";
import FormBuilder from "../components/FormBuilderMain";
import FormFiller from "../components/FormFiller";
import ResponseViewer from "../components/ResponseViewer";

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const formId = searchParams.get('form');
  const viewResponses = searchParams.get('responses');
  
  const handleBack = () => {
    navigate('/');
  };
  
  if (viewResponses === 'true') {
    return (
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <ResponseViewer darkMode={darkMode} setDarkMode={setDarkMode} onBack={handleBack} />}
      </ClientOnly>
    );
  }
  
  if (formId) {
    return (
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <FormFiller formId={formId} darkMode={darkMode} />}
      </ClientOnly>
    );
  }
  
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => <FormBuilder setAppDarkMode={setDarkMode} />}
    </ClientOnly>
  );
}