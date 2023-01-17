import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { pdfjs, PDFViewer } from "../src";
import "./index.css";
import { bundleAnnotationInsert, bundleAnnotationSelect } from "./utils/api";
import { baseURL } from "./utils/request";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.js";

const App = () => {
  const [annotations, setAnnotations] = useState([]);
  const [token, setToken] = useState("");
  const [fileGuid, setFileGuild] = useState("");
  const [pdfURL, setPDFURL] = useState("");

  useEffect(async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    let pdfURL = `${baseURL}/CaseBundleAPI/BundleFilesSelect?fileguid=${params.fileguid}&token=${params.token}`;
    //const result = await fetch(pdfURL, { method: "HEAD" });
    //if (result.ok) {
    setPDFURL(pdfURL);
    setToken(params.token);
    setFileGuild(params.fileguid);

    if (!params?.token || !params?.fileguid) {
      toast.error("Please provide fileguid and token in query string", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    bundleAnnotationSelect({
      fileguid: params.fileguid,
      token: params.token,
    }).then((result) => {
      if (result && result?.Comments) {
        setAnnotations(JSON.parse(result.Comments));
      }
    });

    // fetch("sample-annotations.json")
    //   .then((response) => response.json())
    //   .then(setAnnotations);
    // }
    // else{
    // 	toast.error("Session expired.", {
    // 		position: "top-right",
    // 		autoClose: 5000,
    // 		hideProgressBar: true,
    // 		closeOnClick: true,
    // 		pauseOnHover: true,
    // 		draggable: true,
    // 		progress: undefined,
    // 		theme: "colored",
    // 	  });
    // }
  }, []);

  const onButtonClick = async () => {
    console.log(JSON.stringify(annotations));
    const data = {
      FileGUID: fileGuid,
      Comments: JSON.stringify(annotations),
      token: token,
    };
    let res = await bundleAnnotationInsert(data);
    if (res && res.TokenStatus) {
      toast.success("Annotation saved successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.error("An error occured. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    // await fetch(baseURL + "/CaseBundleAPI/BundleAnnotationInsert", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "access-control-allow-origin": "*",
    //   },
    //   body: JSON.stringify({
    //     FileGUID: fileGuid,
    //     Comments: "testts",
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data) {
    //       toast.success("Annotation saved successfully", {
    //         position: "top-right",
    //         autoClose: 5000,
    //         hideProgressBar: true,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "colored",
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     toast.error("An error occured. Please try again.", {
    //       position: "top-right",
    //       autoClose: 5000,
    //       hideProgressBar: true,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "colored",
    //     });
    //   });

    //await bundleAnnotationInsert(data);
  };

  // CRUD event handlers
  const onCreateAnnotation = (a) => {
    if (!annotations) {
      annotations.push(a);
    } else if (
      annotations?.findIndex((x) => {
        return x.id === a.id;
      }) === -1
    ) {
      annotations.push(a);
    }
  };
  const onUpdateAnnotation = (curr, prev) => {
    let newAnnotation = annotations.filter((el) => {
      return el.id !== prev.id;
    });
    newAnnotation.push(curr);
    setAnnotations(newAnnotation);
  };
  const onDeleteAnnotation = (a) => {
    let newAnnotation = annotations.filter((el) => {
      return el.id !== a.id;
    });
    setAnnotations(newAnnotation);
  };

  return (
    <div className="dv-content">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Same as */}
      <ToastContainer />
      <button className="button" onClick={onButtonClick}>
        Save changes
      </button>
      <PDFViewer
        mode="scrolling"
        config={{
          relationVocabulary: ["located_at", "observed_at"],
        }}
        url={"pdf-example-bookmarks.pdf"}
        annotations={annotations}
        onCreateAnnotation={onCreateAnnotation}
        onUpdateAnnotation={onUpdateAnnotation}
        onDeleteAnnotation={onDeleteAnnotation}
      />
    </div>
  );
};

window.onload = function () {
  ReactDOM.render(<App />, document.getElementById("app"));
};
