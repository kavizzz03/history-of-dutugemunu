import fs from 'node:fs';
import { feature } from 'topojson-client';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json','utf8'));
const fc = feature(topo, topo.objects.countries);
const lk = fc.features.find(f => f.properties.name === 'Sri Lanka');
const polys = lk.geometry.type === 'Polygon' ? [lk.geometry.coordinates] : lk.geometry.coordinates;
// main island = polygon with most points
const main = polys.map(p=>p[0]).sort((a,b)=>b.length-a.length)[0];
const r = main.map(([x,y])=>[+x.toFixed(4), +y.toFixed(4)]);
console.log('points', r.length, 'minlon', Math.min(...r.map(p=>p[0])), 'maxlon', Math.max(...r.map(p=>p[0])), 'minlat', Math.min(...r.map(p=>p[1])), 'maxlat', Math.max(...r.map(p=>p[1])));
fs.writeFileSync('lib/lk-outline.json', JSON.stringify(r));
