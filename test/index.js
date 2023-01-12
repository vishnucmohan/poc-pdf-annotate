import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { pdfjs, PDFViewer } from '../src';
import './index.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

const App = () => {
	const [ annotations, setAnnotations ] = useState([]);

	useEffect(() => {
		fetch('sample-annotations.json').then((response) => response.json()).then(setAnnotations);
	}, []);

	const onButtonClick = () => {
		console.log(annotations);
	};

	// CRUD event handlers
	const onCreateAnnotation = (a) => {
		if (
			annotations.findIndex((x) => {
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
			<button className="button" onClick={onButtonClick}>
				Save changes
			</button>
			<PDFViewer
				mode="scrolling"
				config={{
					relationVocabulary: [ 'located_at', 'observed_at' ]
				}}
				url="pdf-example-bookmarks.pdf"
				annotations={annotations}
				onCreateAnnotation={onCreateAnnotation}
				onUpdateAnnotation={onUpdateAnnotation}
				onDeleteAnnotation={onDeleteAnnotation}
			/>
		</div>
	);
};

window.onload = function() {
	ReactDOM.render(<App />, document.getElementById('app'));
};
