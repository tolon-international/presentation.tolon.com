var languages = {};
var default_language = "en";
var load_languages = ['en', 'tr']
for (var i=0; i < load_languages.length; i++) {
    let language = load_languages[i];
    load_languages[i] = fetch(`language/${language}.json`)
        .then(
            (response)=> {
                console.log(`Loading ${response.url}: Status ${response.status}`);
                if (response.status !== 200) {
                    return;
                }


                return response.json();
            }
        )
        .then(
            (json)=> {
                languages[json.language.code] = Object.assign(
                    {},
                    {language: json.language, links: json.links},
                    json[document.firstElementChild.dataset.langkey]
                );
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    }

let load_document = new Promise (
    (fulfill, reject) => {
        document.addEventListener('DOMContentLoaded',()=>  { fulfill(); });
        document.addEventListener('error',           (e)=> { reject(e); });
    }
);

let template = "";
let prep_template = load_document.then( () => {
    template = document.getElementById('template').innerHTML;
    Mustache.parse(template);
});

let switch_language = (lang) => {
    var target = document.getElementById('template');
    target.innerHTML = Mustache.render(template,languages[lang]);
}

Promise.all(load_languages.concat([prep_template])).then(()=>{
    switch_language(default_language);
});