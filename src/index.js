import 'bootstrap/dist/css/bootstrap.min.css';
import { pipe, tap, ifElse, isEmpty } from 'ramda';
import getInputValue from './getInputValue';
import getUrl from './getUrl';
import Results from './Results';

const render = markup => {
    const resultsElement = document.getElementById('results');

    resultsElement.innerHTML = markup;
};

const renderSearchResults = pipe(Results, render);
const renderSearchNoResults = pipe(noResultReason => [noResultReason, [], [], []], renderSearchResults);

const searchAndRenderResults = pipe(
    getUrl,
    url =>
        fetch(url)
            .then(res => res.json())
            .then(tap(console.warn))
            .then(renderSearchResults)
            .catch(renderSearchNoResults)
);

const makeSearchRequestIfValid = pipe(
    getInputValue,
    ifElse(isEmpty, renderSearchNoResults, searchAndRenderResults),

);

const inputElement = document.querySelector('input');

inputElement.addEventListener('keyup', makeSearchRequestIfValid);
