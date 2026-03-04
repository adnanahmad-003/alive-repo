const fs = require('fs');
fetch('https://dev.iamalive.app/api/destinations/experience/learn-horse-riding-and-trot-down-a-private-forest-trail?fields=gallery')
  .then(res => res.json())
  .then(data => {
    const items = data.data.gallery.raw;
    const vids = items.filter(i => i.type === 'video');
    console.log("Videos:", vids);
    vids.forEach(v => {
      const dups = items.filter(i => i._id === v._id);
      console.log("Items with same ID as video:", dups);
    });
  });
