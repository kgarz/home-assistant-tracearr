'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const vm = require('node:vm');
const source = readFileSync(join(__dirname, '..', 'custom_components/tracearr_ha/frontend/tracearr-card.js'), 'utf8');
function load(language='en-US') {
  const classes = new Map();
  class Element {
    constructor() { this.style = {}; }
    attachShadow() {
      this.shadowRoot = {innerHTML:'', querySelector:()=>null, querySelectorAll:()=>[]};
      return this.shadowRoot;
    }
    dispatchEvent() {}
  }
  const env = {HTMLElement:Element, navigator:{language},
    window:{customCards:[], matchMedia:()=>({matches:false})}, document:{hidden:false},
    customElements:{get:key=>classes.get(key), define:(key,value)=>classes.set(key,value)},
    setInterval:()=>1, clearInterval:()=>{}, setTimeout:()=>1, clearTimeout:()=>{},
    requestAnimationFrame:()=>1, cancelAnimationFrame:()=>{}, performance:{now:()=>0},
    CSS:{escape:s=>s}, CustomEvent:class {}, Date, URL, console};
  vm.runInNewContext(source,env);
  return {classes,env};
}
function stream(changes={}) {
  return {id:'one',server_id:'plex',server_name:'Reckplex',server_type:'plex',username:'Alice',
    media_type:'episode',media_title:'En pause',show_title:'Lectures en cours',
    season_number:2,episode_number:4,state:'paused',duration_ms:3600000,progress_ms:600000,
    video_decision:'directplay',audio_decision:'transcode',...changes};
}
for (const type of ['tracearr-streams-card','tracearr-stream-card']) {
  test(`${type}: English playback labels and media names`,()=>{
    const {classes}=load(); const card=new (classes.get(type))();
    card.setConfig({type:`custom:${type}`,language:'en',series_episode_style:'long',show_end_time:true});
    const html=card._streamCard({servers:[{server_id:'plex',status:'down'}]},stream());
    for(const text of ['Playback paused','Server offline','Video : Direct play','Audio : Transcoding','Season 2','Episode 4','time-paused">Paused'])assert.ok(html.includes(text),text);
    // These happen to match built-in French strings; content is still preserved.
    assert.ok(html.includes('Lectures en cours'));
    assert.ok(html.includes('En pause'));
    const fields=card._mediaFields(stream());
    assert.deepEqual(Array.from(fields,f=>f.text),['Lectures en cours','Season 2','Episode 4','En pause']);
    const playing=card._streamCard({servers:[]},stream({state:'playing'}));
    assert.ok(playing.includes('Ends at'));
    assert.ok(!playing.includes('Fin à'));
  });
  test(`${type}: English editor covers all sections, fields and accessibility labels`,()=>{
    const {classes}=load(); const editor=new (classes.get('tracearr-card-editor'))();
    editor.setConfig({type:`custom:${type}`,language:'en',header_entity_badges:[{id:'custom',entity:'sensor.test',label:'En pause'}]});
    const html=editor.shadowRoot.innerHTML;
    for(const text of ['General display','Stream selection and filters','Header and badges','Titles, seasons and years','Stream information footer','Local / remote bandwidth','Advanced card settings','Language','Choose an entity','Remove badge','Movie title','Episode number','Stream count','Move up','Settings → Devices &amp; services'])assert.ok(html.includes(text),text);
    assert.ok(html.includes('value="En pause"'),'saved custom badge label survives');
    for(const text of ['Affichage général','Choix des lectures','Paramètres','Durée','Nom du serveur','Afficher le titre'])assert.ok(!html.includes(text),text);
    assert.ok(html.includes('value="en"'));
    assert.ok(html.includes('value="fr"'));
  });
}
test('automatic language, regional French and unsupported languages',()=>{
  for(const [browser,hass,expected] of [['en-US','fr-CA','fr'],['fr-FR','en-GB','en'],['de-DE',null,'en'],['fr-CA',null,'fr']]){
    const {classes}=load(browser); const card=new (classes.get('tracearr-streams-card'))();
    card.setConfig({});
    if(hass)card.hass={language:hass};
    assert.equal(card._language(),expected);
    assert.ok(card.shadowRoot.innerHTML.includes(expected==='fr'?'Aucune lecture en cours':'Nothing playing'));
  }
});
test('explicit card language overrides Home Assistant and live profile changes rerender',()=>{
  const {classes}=load();const card=new (classes.get('tracearr-streams-card'))();
  card.setConfig({language:'en'});card.hass={language:'fr'};
  assert.ok(card.shadowRoot.innerHTML.includes('Nothing playing'));
  card.setConfig({language:'auto'});
  assert.ok(card.shadowRoot.innerHTML.includes('Aucune lecture en cours'));
  card.hass={language:'en'};
  assert.ok(card.shadowRoot.innerHTML.includes('Nothing playing'));
  const editor=new (classes.get('tracearr-card-editor'))();editor.setConfig({});
  editor.hass={language:'fr'};assert.ok(editor.shadowRoot.innerHTML.includes('Affichage général'));
  editor.hass={language:'en'};assert.ok(editor.shadowRoot.innerHTML.includes('General display'));
});
test('custom titles, messages, badge names and escaping survive localization',()=>{
  const {classes}=load();const card=new (classes.get('tracearr-streams-card'))();
  card.setConfig({language:'en',title:'Lectures en cours <script>',empty_message:'Aucune lecture en cours <b>',header_metric_settings:{paused:{label:'Pause'}} ,header_show_paused:true});
  assert.ok(card.shadowRoot.innerHTML.includes('Lectures en cours &lt;script&gt;'));
  assert.ok(card.shadowRoot.innerHTML.includes('Aucune lecture en cours &lt;b&gt;'));
  assert.ok(card._header([]).includes('Pause : 0'),'custom badge name is not translated');
  card._payload={entries:[{id:'entry',connected:false,streams:[]}]};card.render();
  assert.ok(card.shadowRoot.innerHTML.includes('Tracearr unavailable'));
});
test('English singular/plural stream counts and French compatibility',()=>{
  const {classes}=load();const card=new (classes.get('tracearr-streams-card'))();
  card.setConfig({language:'en'});
  assert.ok(card._header([stream()]).includes('1 stream'));
  assert.ok(card._header([stream(),stream({id:'two'})]).includes('2 streams'));
  card.setConfig({language:'fr'});
  assert.ok(card._header([stream()]).includes('1 flux'));
  assert.ok(card._streamCard({},stream()).includes('time-paused">En pause'));
});
test('card picker descriptions use browser language before HA is available',()=>{
  for(const language of ['en-US','fr-FR']){
    const {env}=load(language);
    assert.ok(env.window.customCards[0].name.includes(language==='fr-FR'?'Lectures en cours':'Now playing'));
  }
});

test('card picker follows HA language after connection and does not duplicate registrations',()=>{
  const {classes,env}=load('fr-FR');
  const card=new (classes.get('tracearr-streams-card'))();
  card.setConfig({language:'fr'});card.hass={language:'en'};
  assert.equal(env.window.customCards.length,2);
  assert.ok(env.window.customCards[0].name.includes('Now playing'));
  card.hass={language:'fr-CA'};
  assert.equal(env.window.customCards.length,2);
  assert.ok(env.window.customCards[1].name.includes('Lecture individuelle'));
});
test('changing language in the visual editor rerenders and emits the saved option',()=>{
  const {classes}=load('fr-FR');const editor=new (classes.get('tracearr-card-editor'))();
  const listeners=new Map(), events=[];
  const select={dataset:{field:'language'},tagName:'SELECT',type:'select-one',value:'auto',
    addEventListener:(event,fn)=>listeners.set(event,fn)};
  editor.shadowRoot.querySelectorAll=selector=>selector==='[data-field]'?[select]:[];
  editor.dispatchEvent=event=>events.push(event);
  editor.setConfig({});
  editor._openSections.add('media');
  assert.ok(editor.shadowRoot.innerHTML.includes('Affichage général'));
  select.value='en';listeners.get('change')();
  assert.equal(editor._config.language,'en');
  assert.ok(editor.shadowRoot.innerHTML.includes('General display'));
  assert.ok(editor._openSections.has('media'));
  assert.equal(events.length,1);
});
