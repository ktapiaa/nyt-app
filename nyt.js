const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  const key = '3Cm3bHxG1I3ROE2N94Y8vw7347XEAaQk';
  let url;


  const searchTerm = document.querySelector('.search');
  const startDate = document.querySelector('.start-date');
  const endDate = document.querySelector('.end-date');
  const searchForm = document.querySelector('form');

  const nextBtn = document.querySelector('.next');
  const previousBtn = document.querySelector('.prev');

  const section = document.querySelector('section');
  const nav = document.querySelector('nav');

 
  nav.style.display = 'none';


  let pageNumber = 0;
  console.log('PageNumber:', pageNumber);
  let displayNav =false;


  searchForm.addEventListener('submit', fetchResults);
  nextBtn.addEventListener('click', nextPage);
  previousBtn.addEventListener('click', previousPage);

//   searchForm.addEventListener('submit', submitSearch);
//   nextBtn.addEventListener('click', nextPage);
//   previousBtn.addEventListener('click', previousPage);

  function submitSearch(e){
    pageNumber = 0;
    fetchResults(e);
  }

  function fetchResults(e) {
    e.preventDefault();
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value + '&fq=document_type:("article")';
    console.log("URL:", url);

    if(startDate.value !== '') {
      url += '&begin_date=' + startDate.value;
    };

    if(endDate.value !== '') {
      url += '&end_date=' + endDate.value;
    };


    fetch(url).then(function(result) {
      return result.json();
    }).then(function(json) {
      displayResults(json);
    });
  }

  function displayResults(json) {
    while (section.firstChild) {
      section.removeChild(section.firstChild);
    }

    const articles = json.response.docs;

    if(articles.length === 10) {
      nav.style.display = 'block';
    } 
    // else {
    //         nav.style.displayResults='';
    //     } 
        else {
      nav.style.display = 'none';
    }

    // let articleLength = article.length;
    // let totalPages = article.length / 10;
    // if(pageNumber = totalPages) {
    //     nav.style.display = 'block';
    // }


    if(articles.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No results returned.'
      section.appendChild(para);
    } else {
      for(let i = 0; i < articles.length; i++) {
        const article = document.createElement('article');
        const heading = document.createElement('h2');
        const link = document.createElement('a');
        const img = document.createElement('img');
        const para1 = document.createElement('p');
        const para2 = document.createElement('p');
        const clearfix = document.createElement('div');

        const current = articles[i];
        console.log(current);

        link.href = current.web_url;
        link.textContent = current.headline.main;
        para1.textContent = current.snippet;
        para2.textContent = 'Keywords: ';
        for(let j = 0; j < current.keywords.length; j++) {
          const span = document.createElement('span');
          span.textContent = current.keywords[j].value + ' ';
          para2.appendChild(span);
        }

        if(current.multimedia.length > 0) {
          img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
          img.alt = current.headline.main;
        }

        clearfix.setAttribute('class','clearfix');

        article.appendChild(heading);
        heading.appendChild(link);
        article.appendChild(img);
        article.appendChild(para1);
        article.appendChild(para2);
        article.appendChild(clearfix);
        section.appendChild(article);
      }
    }
  };

  function nextPage(e) {
    pageNumber++;
    fetchResults(e);
    console.log("Page number:", pageNumber);
  };

  function previousPage(e) {
    if(pageNumber > 0) {
      pageNumber--;
    } else {
      return;
    }
    fetchResults(e);
    console.log("Page:". pageNumber);
  };