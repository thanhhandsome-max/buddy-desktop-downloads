let checksum='';
function sizeLabel(bytes){return bytes<1048576?(bytes/1024).toFixed(0)+' KiB':(bytes/1048576).toFixed(1)+' MiB';}
function enableDownload(id,url){const a=document.getElementById(id);if(!a)return;const target=new URL(url,location.href);if(target.origin!==location.origin&&!(target.protocol==='https:'&&target.hostname==='github.com'&&target.pathname.startsWith('/thanhhandsome-max/buddy-desktop-downloads/releases/download/')))throw Error('download origin');a.href=target.href;a.setAttribute('download','');a.removeAttribute('aria-disabled');a.classList.remove('disabled');}
fetch('./release.json',{cache:'no-store'}).then(async r=>{
 if(!r.ok)throw Error('release');const data=await r.json();if(!data.available)throw Error('unavailable');
 for(const id of ['download-main','download-secondary','download-desktop-card'])enableDownload(id,data.url);
 document.getElementById('download-label').textContent='Tải Buddy cho Windows';document.getElementById('release-meta').textContent=`Windows x64 · ${sizeLabel(data.size)} · ZIP Preview`;
 const desktopSize=document.getElementById('size-desktop-card');if(desktopSize)desktopSize.textContent=sizeLabel(data.size)+' · '+data.version;
 const cardChecksum=document.getElementById('checksum-desktop-card');if(cardChecksum)cardChecksum.textContent=data.sha256;
 checksum=data.sha256;document.getElementById('checksum').textContent=checksum;document.getElementById('copy-checksum').disabled=false;
 for(const variant of data.variants||[]){if(!['terminal-portable','terminal-minimal'].includes(variant.id)||!variant.available)continue;enableDownload('download-'+variant.id,variant.url);const size=document.getElementById('size-'+variant.id),hash=document.getElementById('checksum-'+variant.id);if(size)size.textContent=sizeLabel(variant.size)+' · '+(variant.requiresNode?'cần Node.js 24+':'đã kèm Node')+' · '+variant.version;if(hash)hash.textContent=variant.sha256;}
}).catch(()=>{
 if(document.getElementById('download-main').getAttribute('href'))return;
 document.getElementById('download-label').textContent='Bản tải đang được chuẩn bị';document.getElementById('release-meta').textContent='Chưa có tệp phát hành trên máy chủ này.';document.getElementById('checksum').textContent='Chưa có bản phát hành.';
});
document.getElementById('copy-checksum').onclick=async()=>{try{if(!checksum)checksum=document.getElementById('checksum').textContent;if(!/^[a-f0-9]{64}$/.test(checksum))throw Error('checksum');await navigator.clipboard.writeText(checksum);document.getElementById('copy-status').textContent='Đã sao chép.';}catch{document.getElementById('copy-status').textContent='Chọn và sao chép chuỗi phía trên.';}};
