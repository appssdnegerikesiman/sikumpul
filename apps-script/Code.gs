/* Deploy as owner; anonymous access is allowed only to the explicit public actions.
 * Spreadsheet schema was inspected on 2026-10-15. Never publish this spreadsheet/Drive folder.
 */
const SHEET_ID = '1W5xBJOEPjWcSG1CM9BuGCdRxAaHd0DeRaeXcnEadyqk';
const TZ = 'Asia/Makassar';
const CLASSES = ['I','II','III','IV','V','VI'].reduce((a,c)=>a.concat(c+' A',c+' B'),[]);
const HABIT_COLUMNS = [7,9,11,13,15,17,19];
const PHOTO_COLUMNS = {1:7,2:5,3:6};
const PHOTO_NAMES = {1:'Beribadah',2:'Berolahraga',3:'Makan Sehat'};
const MAX_PHOTO = 5242880;
function fail_(message){const e=new Error(message);e.userFacing=true;throw e;}
function book_(){return SpreadsheetApp.openById(SHEET_ID);}
function sheet_(name){const s=book_().getSheetByName(name);if(!s)fail_('Tab database belum tersedia. Hubungi guru.');return s;}
function rows_(name){const s=sheet_(name);return s.getLastRow()>1?s.getRange(2,1,s.getLastRow()-1,s.getLastColumn()).getValues():[];}
function day_(){return Utilities.formatDate(new Date(),TZ,'yyyy-MM-dd');}
function date_(v){if(v instanceof Date)return Utilities.formatDate(v,TZ,'yyyy-MM-dd');return String(v||'').trim().slice(0,10);}
function clean_(v,max){const s=String(v||'').normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim();if(s.length>max)fail_('Teks terlalu panjang.');return s;}
function cell_(v){const s=String(v==null?'':v);return /^[=+@-]/.test(s)?"'"+s:s;}
function class_(v){const c=clean_(v,10).toUpperCase();if(CLASSES.indexOf(c)<0)fail_('Pilih kelas yang valid.');return c;}
function hash_(v){return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,v));}
function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return json_({ok:true,data:{sekolah:'SD Negeri 3 Kesiman',timezone:TZ,tanggal:day_()}});}
function doPost(e){try{
 if(!e||!e.postData||e.postData.contents.length>22000000)fail_('Permintaan tidak valid atau terlalu besar.');
 const req=JSON.parse(e.postData.contents);const p=req.payload||{};
 if(req.action==='publicSettings')return doGet();
 if(req.action==='submitJournal'||req.action==='updateJournal')return json_({ok:true,data:submit_(p)});
 requireAdmin_(req.token);
 if(req.action==='adminSummary'||req.action==='adminClassRecap'||req.action==='adminReport')return json_({ok:true,data:summary_(p)});
 if(req.action==='adminDetail')return json_({ok:true,data:detail_(p.id)});
 if(req.action==='adminPhoto')return json_({ok:true,data:photo_(p.id)});
 fail_('Aksi tidak tersedia.');
 }catch(err){console.error('Request failed: '+err.message);return json_({ok:false,error:err.userFacing?err.message:'Layanan belum tersedia. Coba lagi nanti atau hubungi guru.'});}}
function requireAdmin_(token){
 if(typeof token!=='string'||token.length<100||token.length>6000)fail_('Silakan masuk dengan akun Google guru.');
 const props=PropertiesService.getScriptProperties();const client=props.getProperty('GOOGLE_CLIENT_ID');const allow=(props.getProperty('ADMIN_EMAILS')||'').toLowerCase().split(',').map(s=>s.trim());
 if(!client||!allow.filter(Boolean).length)fail_('Akses guru belum dikonfigurasi.');
 const res=UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(token),{muteHttpExceptions:true});
 if(res.getResponseCode()!==200)fail_('Sesi berakhir. Keluar lalu masuk kembali.');
 const user=JSON.parse(res.getContentText());
 if(user.aud!==client||['accounts.google.com','https://accounts.google.com'].indexOf(user.iss)<0||Number(user.exp)*1000<=Date.now()||String(user.email_verified)!=='true'||allow.indexOf(String(user.email).toLowerCase())<0)fail_('Akun ini tidak diizinkan mengakses ruang guru.');
 return user.email;
}
function validate_(p){
 const kelas=class_(p.kelas),absen=Number(p.absen),nama=clean_(p.nama,100),tanggal=String(p.tanggal||'');
 if(!Number.isInteger(absen)||absen<1||absen>38||nama.length<2)fail_('Lengkapi identitas dengan benar.');
 if(tanggal!==day_())fail_('Tanggal sudah berganti. Muat ulang halaman untuk jurnal hari ini (WITA).');
 if(typeof p.editKey!=='string'||!/^[a-f0-9]{64}$/.test(p.editKey))fail_('Kunci pengiriman tidak valid. Muat ulang halaman.');
 if(!Array.isArray(p.answers)||p.answers.length!==7)fail_('Isi ketujuh kebiasaan.');
 const answers=p.answers.map((a,i)=>{
  if(!a||['Sudah','Belum'].indexOf(a.status)<0)fail_('Pilih Sudah atau Belum untuk seluruh kebiasaan.');
  const photo=a.status==='Sudah'&&Object.prototype.hasOwnProperty.call(PHOTO_COLUMNS,i)?a.photo:null;
  if((i===2||i===3)&&a.status==='Sudah'&&!photo)fail_('Foto olahraga dan makan sehat wajib saat memilih Sudah.');
  if(photo)validatePhoto_(photo);
  return {status:a.status,note:clean_(a.note,500),photo:photo};
 });
 return {kelas,absen,nama,tanggal,answers,editKey:p.editKey,consent:p.consent===true,id:tanggal+'|'+kelas+'|'+absen};
}
function validatePhoto_(p){
 const mimes=['image/jpeg','image/png','image/webp'];if(!p||mimes.indexOf(p.mime)<0||typeof p.data!=='string'||p.data.length>6990508||!/^[A-Za-z0-9+/]+={0,2}$/.test(p.data))fail_('Foto harus JPG, PNG, atau WebP maksimal 5 MB.');
 const bytes=Utilities.base64Decode(p.data);const b=bytes.slice(0,12).map(x=>(x+256)%256);
 const valid=p.mime==='image/jpeg'?b[0]===255&&b[1]===216&&b[2]===255:p.mime==='image/png'?[137,80,78,71,13,10,26,10].every((x,i)=>b[i]===x):String.fromCharCode.apply(null,b.slice(0,4))==='RIFF'&&String.fromCharCode.apply(null,b.slice(8,12))==='WEBP';
 if(bytes.length>MAX_PHOTO||bytes.length<16||!valid)fail_('Isi atau ukuran foto tidak valid.');return bytes;
}
function submit_(input){
 const p=validate_(input);const lock=LockService.getScriptLock();if(!lock.tryLock(30000))fail_('Banyak teman sedang mengirim. Tunggu sebentar lalu coba lagi.');
 const created=[];let committed=false;let uncertain=false;let docRow=0;let oldDoc=null;let docWritten=false;
 try{
  const journal=sheet_('JURNAL_HARIAN');if(journal.getRange('Y1').getValue()!=='Edit Key Hash')fail_('Backend belum disiapkan oleh guru.');
  const roster=rows_('DATA_SISWA').filter(r=>String(r[4]).toLowerCase()==='aktif');
  const student=roster.find(r=>String(r[2]).trim().toUpperCase()===p.kelas&&Number(r[3])===p.absen);
  if(!student||clean_(student[1],100).toLocaleLowerCase('id')!==p.nama.toLocaleLowerCase('id'))fail_('Identitas belum cocok dengan daftar sekolah. Periksa kembali atau hubungi guru.');
  const existing=rows_('JURNAL_HARIAN');const at=existing.findIndex(r=>date_(r[1])===p.tanggal&&r[5]===p.kelas&&Number(r[6])===p.absen);
  const digest=hash_(p.editKey);if(at>=0&&existing[at][24]!==digest)fail_('Jurnal hari ini sudah tersimpan dari sesi lain. Hubungi guru untuk perbaikan.');
  const fingerprint=hash_(JSON.stringify({nama:p.nama,answers:p.answers,consent:p.consent}));
  if(at>=0&&existing[at][25]===fingerprint)return {id:p.id,updated:true};
  const cache=CacheService.getScriptCache();const rate='rate:'+hash_(p.id);if(cache.get(rate))fail_('Tunggu 20 detik sebelum memperbarui jurnal.');
  const folderId=PropertiesService.getScriptProperties().getProperty('PHOTO_FOLDER_ID');
  if(!folderId)fail_('Folder dokumentasi belum dikonfigurasi.');const folder=DriveApp.getFolderById(folderId);
  if(folder.getSharingAccess()!==DriveApp.Access.PRIVATE)fail_('Folder dokumentasi harus privat. Hubungi guru.');
  const sid=p.kelas+'-'+p.absen;const now=new Date().toISOString();
  const doc=[p.id,p.tanggal,sid,cell_(p.nama),p.kelas,'','','',p.consent?'Ya':'Tidak',''];
  p.answers.forEach((a,i)=>{if(a.photo){const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[a.photo.mime];const f=folder.createFile(Utilities.newBlob(validatePhoto_(a.photo),a.photo.mime,Utilities.getUuid()+'.'+ext));created.push(f);doc[PHOTO_COLUMNS[i]]=f.getId();}});
  const docs=sheet_('DOKUMENTASI');const docRows=rows_('DOKUMENTASI');const di=docRows.findIndex(r=>r[0]===p.id);docRow=di>=0?di+2:docs.getLastRow()+1;oldDoc=di>=0?docRows[di].slice(0,10):null;
  docs.getRange(docRow,1,1,10).setValues([doc]);docWritten=true;
  const row=[p.id,p.tanggal,at>=0?existing[at][2]:now,sid,cell_(p.nama),p.kelas,p.absen];p.answers.forEach(a=>row.push(a.status,cell_(a.note)));row.push(p.answers.filter(a=>a.status==='Sudah').length,'Terkumpul',now,digest,fingerprint);
  journal.getRange(at>=0?at+2:journal.getLastRow()+1,1,1,26).setValues([row]);SpreadsheetApp.flush();committed=true;cache.put(rate,'1',20);
  if(oldDoc)[5,6,7].forEach(c=>{if(oldDoc[c])try{DriveApp.getFileById(oldDoc[c]).setTrashed(true);}catch(e){console.warn('Old photo cleanup pending');}});
  return {id:p.id,updated:at>=0};
 }catch(e){
  // A write may have succeeded before a transport/flush error. Confirm before compensating.
  try{committed=rows_('JURNAL_HARIAN').some(r=>r[0]===p.id&&r[24]===hash_(p.editKey)&&r[25]===hash_(JSON.stringify({nama:p.nama,answers:p.answers,consent:p.consent})));}catch(ignore){uncertain=true;}
  if(committed)return {id:p.id,updated:true};
  if(!uncertain){if(docWritten)try{const range=sheet_('DOKUMENTASI').getRange(docRow,1,1,10);if(oldDoc)range.setValues([oldDoc]);else range.clearContent();}catch(ignore){console.error('Documentation rollback needs owner review');}
  created.forEach(f=>{try{f.setTrashed(true);}catch(ignore){console.warn('Orphan cleanup needed');}});}throw e;
 }finally{lock.releaseLock();}
}
function journalObject_(r){return {id:r[0],tanggal:date_(r[1]),nama:r[4],kelas:r[5],absen:Number(r[6]),count:HABIT_COLUMNS.filter(c=>r[c]==='Sudah').length,answers:HABIT_COLUMNS.map(c=>({status:r[c],note:r[c+1]}))};}
function days_(from,to){if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to))fail_('Tanggal tidak valid.');const a=new Date(from+'T00:00:00Z'),b=new Date(to+'T00:00:00Z');if(isNaN(a)||isNaN(b)||a.toISOString().slice(0,10)!==from||b.toISOString().slice(0,10)!==to||b<a||(b-a)/86400000>30)fail_('Pilih rentang maksimal 31 hari.');const dates=[];for(let d=+a;d<=+b;d+=86400000)dates.push(new Date(d).toISOString().slice(0,10));return dates;}
function summary_(p){
 const from=String(p.from||day_()),to=String(p.to||from),days=days_(from,to),kelas=p.kelas?class_(p.kelas):'';
 const rosterMap={};rows_('DATA_SISWA').filter(r=>String(r[4]).toLowerCase()==='aktif'&&(!kelas||r[2]===kelas)).forEach(r=>{rosterMap[r[2]+'|'+Number(r[3])]={nama:r[1],kelas:r[2],absen:Number(r[3])};});const roster=Object.keys(rosterMap).map(k=>rosterMap[k]);
 const unique={};rows_('JURNAL_HARIAN').filter(r=>date_(r[1])>=from&&date_(r[1])<=to&&rosterMap[r[5]+'|'+Number(r[6])]).forEach(r=>{unique[date_(r[1])+'|'+r[5]+'|'+Number(r[6])]=journalObject_(r);});const journals=Object.keys(unique).map(k=>unique[k]);
 const absent=[];days.forEach(d=>roster.forEach(s=>{if(!unique[d+'|'+s.kelas+'|'+s.absen])absent.push(Object.assign({tanggal:d},s));}));
 const opportunities=roster.length*days.length;const habits=HABIT_COLUMNS.map((c,i)=>({sudah:journals.filter(j=>j.answers[i].status==='Sudah').length,belum:journals.filter(j=>j.answers[i].status==='Belum').length,missing:opportunities-journals.length}));
 const recap=CLASSES.filter(c=>!kelas||c===kelas).map(c=>{const total=roster.filter(s=>s.kelas===c).length,js=journals.filter(j=>j.kelas===c),n=total*days.length;return {kelas:c,total,submitted:js.length,missing:n-js.length,percent:n?Math.round(js.length/n*100):0,habits:HABIT_COLUMNS.map((_,i)=>js.filter(j=>j.answers[i].status==='Sudah').length)};});
 const ids=new Set(journals.map(j=>j.id));const documentation=[];rows_('DOKUMENTASI').filter(r=>ids.has(r[0])&&r[8]==='Ya').forEach(r=>Object.keys(PHOTO_COLUMNS).forEach(i=>{if(r[PHOTO_COLUMNS[i]])documentation.push({id:r[PHOTO_COLUMNS[i]],kind:PHOTO_NAMES[i],tanggal:date_(r[1]),kelas:r[4]});}));
 return {from,to,kelas,days:days.length,total:roster.length,opportunities,submitted:journals.length,missing:absent.length,percent:opportunities?Math.round(journals.length/opportunities*100):0,habits,classes:recap,rows:journals.map(j=>({id:j.id,tanggal:j.tanggal,nama:j.nama,kelas:j.kelas,absen:j.absen,count:j.count})),absent,documentation};
}
function detail_(id){const r=rows_('JURNAL_HARIAN').find(r=>r[0]===id);if(!r)fail_('Jurnal tidak ditemukan.');const j=journalObject_(r);const d=rows_('DOKUMENTASI').find(d=>d[0]===id);j.photos=[];if(d)Object.keys(PHOTO_COLUMNS).forEach(i=>{if(d[PHOTO_COLUMNS[i]])j.photos.push({id:d[PHOTO_COLUMNS[i]],kind:PHOTO_NAMES[i]});});return j;}
function photo_(id){if(typeof id!=='string'||!rows_('DOKUMENTASI').some(r=>[5,6,7].some(c=>r[c]===id)))fail_('Foto tidak ditemukan.');const f=DriveApp.getFileById(id);const folder=PropertiesService.getScriptProperties().getProperty('PHOTO_FOLDER_ID');const parents=f.getParents();let inside=false;while(parents.hasNext())if(parents.next().getId()===folder)inside=true;if(!inside||f.isTrashed()||f.getSize()>MAX_PHOTO)fail_('Foto tidak tersedia.');const blob=f.getBlob();if(['image/jpeg','image/png','image/webp'].indexOf(blob.getContentType())<0)fail_('Tipe foto tidak valid.');return {src:'data:'+blob.getContentType()+';base64,'+Utilities.base64Encode(blob.getBytes())};}
/** Run once manually in editor, authorized as owner. Preserves existing tabs/data. */
function setup(){const b=book_();b.setSpreadsheetTimeZone(TZ);const checks={DATA_SISWA:['ID Siswa (Otomatis: Kelas-Absen)','Nama Lengkap','Kelas','No. Absen (Dropdown 1-38)','Status Aktif'],JURNAL_HARIAN:['ID Jurnal','Tanggal','Waktu Kirim','ID Siswa (Kelas-Absen)','Nama Siswa (Diketik Sendiri)','Kelas','No. Absen (Dropdown 1-38)','Bangun Pagi','Ket. Bangun Pagi','Beribadah','Ket. Beribadah','Berolahraga','Ket. Berolahraga','Makan Sehat Bergizi','Ket. Makan','Gemar Belajar','Ket. Belajar','Bermasyarakat','Ket. Bermasyarakat','Tidur Cepat','Ket. Tidur','Jumlah Sudah','Status Jurnal','Terakhir Diperbarui'],DOKUMENTASI:['ID Jurnal','Tanggal','ID Siswa (Kelas-Absen)','Nama Siswa (Diketik Sendiri)','Kelas','Foto Olahraga ID Drive','Foto Makan Sehat ID Drive','Foto Ibadah Opsional ID Drive','Izin Dokumentasi','Catatan']};Object.keys(checks).forEach(name=>{const actual=sheet_(name).getRange(1,1,1,checks[name].length).getValues()[0];if(JSON.stringify(actual)!==JSON.stringify(checks[name]))fail_('Header '+name+' berubah. Sesuaikan pemetaan sebelum melanjutkan.');});const s=sheet_('JURNAL_HARIAN');const extra=s.getRange('Y1:Z1').getValues()[0];if(extra.some((x,i)=>x&&x!==['Edit Key Hash','Payload Hash'][i]))fail_('Kolom Y/Z sudah dipakai.');s.getRange('Y1:Z1').setValues([['Edit Key Hash','Payload Hash']]);s.hideColumns(25,2);const props=PropertiesService.getScriptProperties();if(!props.getProperty('PHOTO_FOLDER_ID')){const folder=DriveApp.createFolder('Dokumentasi Privat 7 KAIH');folder.setSharing(DriveApp.Access.PRIVATE,DriveApp.Permission.VIEW);props.setProperty('PHOTO_FOLDER_ID',folder.getId());}console.log('Setup selesai. Isi GOOGLE_CLIENT_ID dan ADMIN_EMAILS di Script Properties.');}
/** Only the owner can run this in editor for a forgotten submission session. */
function ownerRemoveJournalForCorrection(){fail_('Gunakan editor Sheet untuk koreksi terverifikasi; jangan membuat endpoint reset publik.');}
