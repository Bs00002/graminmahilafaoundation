/**
 * GRAMEEN MAHILA FOUNDATION
 * Interactive Scripts (Simple English)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.querySelector('.mobile-toggle-btn, .menu-toggle');
  const mainNav = document.querySelector('.nav-links-wrapper, .main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mainNav.classList.toggle('open', !isExpanded);
    });

    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
      });
    });
  }

  // 2. Active Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links-wrapper a[href^="#"], .main-nav a[href^="#"]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // 3. Gallery Filtering
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.dataset.filter;

        galleryItems.forEach(item => {
          const category = item.dataset.category;
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Lightbox Modal
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentGalleryIndex = 0;
  const getVisibleGalleryItems = () => Array.from(document.querySelectorAll('.gallery-item')).filter(el => el.style.display !== 'none');

  const openLightbox = (index) => {
    const visible = getVisibleGalleryItems();
    if (!visible[index]) return;
    currentGalleryIndex = index;
    const item = visible[index];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-overlay strong')?.textContent || '';
    const desc = item.querySelector('.gallery-overlay span')?.textContent || '';

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || title;
    lightboxCaption.textContent = title + (desc ? ` — ${desc}` : '');
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const visible = getVisibleGalleryItems();
      const index = visible.indexOf(item);
      if (index !== -1) openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      const visible = getVisibleGalleryItems();
      if (visible.length === 0) return;
      currentGalleryIndex = (currentGalleryIndex - 1 + visible.length) % visible.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const visible = getVisibleGalleryItems();
      if (visible.length === 0) return;
      currentGalleryIndex = (currentGalleryIndex + 1) % visible.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev?.click();
    if (e.key === 'ArrowRight') lightboxNext?.click();
  });

  // 5. Video Playback Management (one playing video at a time)
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(vid => {
    vid.addEventListener('play', () => {
      allVideos.forEach(otherVid => {
        if (otherVid !== vid && !otherVid.paused) {
          otherVid.pause();
        }
      });
    });
  });

  // 6. Contact Form Submission Handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value.trim();
      const phone = document.getElementById('senderPhone')?.value.trim();

      if (!name || !phone) {
        alert('Please enter your name and phone number.');
        return;
      }

      formStatus.style.display = 'block';
      formStatus.className = 'form-status-alert success';
      formStatus.innerHTML = `<strong>Thank you, ${name}!</strong> Your message has been received. Our team will contact you soon.`;
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Message Sent ✓';
      }

      contactForm.reset();
    });
  }

  // 6b. Volunteer Form Submission Handling
  const volunteerForm = document.getElementById('volunteerForm');
  const volunteerStatus = document.getElementById('volunteerStatus');

  if (volunteerForm && volunteerStatus) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('volName')?.value.trim();
      const phone = document.getElementById('volPhone')?.value.trim();

      if (!name || !phone) {
        alert('Please enter your name and phone number.');
        return;
      }

      volunteerStatus.style.display = 'block';
      volunteerStatus.className = 'form-status-alert success';
      volunteerStatus.innerHTML = `<strong>Thank you, ${name}!</strong> Your volunteer application has been received. Our volunteer coordinator will reach out to you shortly.`;

      const submitBtn = volunteerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Application Received ✓';
      }

      volunteerForm.reset();
    });
  }

  // 7. Activity Details Modal ("Learn More")
  const activitiesData = {
    sewing: {
      title: 'Sewing Training',
      badge: "Women's Training",
      img: 'images/women/sewing-machine-training.jpg',
      desc: 'At our Sanand training center, we teach women how to use sewing machines, understand machine parts, measure fabric, and cut and stitch clothes with confidence.',
      points: [
        'Learn how sewing machines work and how to maintain them',
        'Step-by-step training in fabric cutting, measurement, and stitching',
        'Build practical tailoring skills to earn an income from home',
        'Friendly support and guidance from experienced instructors'
      ],
      waText: 'Hello, I would like more information about Sewing Training at Grameen Mahila Foundation.'
    },
    painting: {
      title: 'Painting Training',
      badge: 'Creative Skills',
      img: 'images/painting/painting-training-1.jpg',
      desc: 'We teach fabric painting, decorative crafts, and design techniques to village women and girls so they can turn their artistic talents into a source of income.',
      points: [
        'Hands-on practice in fabric painting and traditional patterns',
        'Guidance on brush control, color combinations, and finishing',
        'Opportunities to create handmade items and earn an income',
        'An encouraging space for village women to learn together'
      ],
      waText: 'Hello, I would like more information about Painting Training at Grameen Mahila Foundation.'
    },
    selfdefense: {
      title: 'Self-Defence Training',
      badge: 'Safety & Confidence',
      img: 'images/events/self-defense-camp-official.jpg',
      desc: 'We organize self-defence camps in Sanand and nearby villages to teach schoolgirls and women practical protective techniques and physical confidence.',
      points: [
        'Simple, practical protective moves taught by trained instructors',
        'Building quick reactions, awareness, and self-confidence',
        'Encouraging physical fitness and mental strength for girls',
        'Conducted through dedicated community camps in rural schools'
      ],
      waText: 'Hello, I would like more information about Self-Defence Training at Grameen Mahila Foundation.'
    },
    education: {
      title: 'Student Education Support',
      badge: "Children's Support",
      img: 'images/women/women-classroom-session.jpg',
      desc: 'We support children and students from low-income families with school supplies, notebooks, bags, and financial help for school fees so that no child has to stop studying.',
      points: [
        'Notebooks, stationery kits, and school bags for students in need',
        'Fee assistance to keep bright and determined students in school',
        'Promoting education for village girls and helping them stay enrolled',
        'Learning sessions with positive values and encouragement'
      ],
      waText: 'Hello, I would like to know more about Student Education Support at Grameen Mahila Foundation.'
    },
    food: {
      title: 'Food Support & Nutrition Distribution',
      badge: 'Care & Relief',
      img: 'images/food/food-distribution-1.jpg',
      desc: 'We provide wholesome meals, fresh food packets, and essential ration kits to very poor families, elderly villagers, and children facing hardship in rural communities.',
      points: [
        'Organizing ground food distribution drives for underserved village families',
        'Distributing freshly prepared, hygienic meals and essential grains',
        'Ensuring elderly, daily wage earners, and vulnerable children receive nutrition',
        'Directly documented with authentic ground distribution photographs'
      ],
      waText: 'Hello, I would like to support the Food Distribution drive at Grameen Mahila Foundation.'
    },
    awareness: {
      title: "Women's Awareness Drives",
      badge: "Women's Empowerment",
      img: 'images/awareness/women-awareness-1.jpg',
      desc: "We organize grassroots awareness camps across rural communities to educate women on their legal rights, healthcare, hygiene, child education, and government welfare programs.",
      points: [
        'Village-level interactive sessions guiding women on health, nutrition, and self-care',
        'Guidance on government welfare schemes, banking, and financial empowerment',
        'Encouraging social confidence, self-reliance, and active community participation',
        'Documented with real field photographs from our village meetings'
      ],
      waText: "Hello, I would like to know more about Women's Awareness Drives at Grameen Mahila Foundation."
    },
    clothes: {
      title: 'Clothes Donation',
      badge: 'Community Support',
      img: 'images/placeholder.jpg',
      desc: 'We collect and distribute clean clothes, warm winter garments, and blankets to underprivileged families and children in rural areas.',
      points: [
        'Providing clean, wearable clothes to families in need with dignity',
        'Distributing warm blankets and woolens during cold winter months',
        'Bringing comfort and warmth to village elders and children',
        'Photos will be updated here after our next clothing distribution'
      ],
      waText: 'Hello, I would like to support the Clothes Donation drive at Grameen Mahila Foundation.'
    },
    trees: {
      title: 'Tree Plantation',
      badge: 'Community Support',
      img: 'images/trees/tree-plantation-1.jpg',
      desc: 'We plant trees and take care of green cover in local villages to improve the environment, protect soil, and teach children about nature.',
      points: [
        'Planting native saplings in village commons and school grounds',
        'Teaching local youth and children how to water and protect trees',
        'Creating greener, healthier village surroundings for everyone',
        'Community volunteer drives to encourage environmental care'
      ],
      waText: 'Hello, I would like to join or support the Tree Plantation drive at Grameen Mahila Foundation.'
    },
    disaster: {
      title: 'Disaster Relief',
      badge: 'Emergency Help',
      img: 'images/disaster/disaster-relief-1.jpg',
      desc: 'When floods, severe weather, or emergencies hit rural areas, our team prepares essential food, clean water, and relief supplies for affected families.',
      points: [
        'Quick distribution of emergency ration kits and clean drinking water',
        'Coordinating with local volunteers to reach families facing hardship',
        'Basic support to help vulnerable households get back on their feet',
        'Field updates and real photos from our active relief efforts'
      ],
      waText: 'Hello, I would like information about Disaster Relief at Grameen Mahila Foundation.'
    },
    women: {
      title: "Women's Training",
      badge: "Women's Empowerment",
      img: 'images/sewing/sewing-training-1.jpg',
      desc: "Our comprehensive women's training initiatives combine practical sewing, fabric painting, and self-confidence workshops so rural women can support their families.",
      points: [
        'Practical vocational skills to generate reliable income from home',
        'Health, hygiene, and nutrition guidance for rural women',
        'Guidance on household savings, banking, and government schemes',
        'Encouraging women to participate actively in community life'
      ],
      waText: "Hello, I would like information about Women's Training at Grameen Mahila Foundation."
    },
    children: {
      title: "Children's Support",
      badge: "Child Welfare",
      img: 'images/children/girls-self-defense-training.jpg',
      desc: 'We support children with educational materials, safety awareness, and encouragement to help them build a brighter future.',
      points: [
        'Free school kits, notebooks, and learning supplies',
        'Self-defence training and confidence building for young girls',
        'Promoting girls education and regular school attendance',
        'Community activities that teach positive values and teamwork'
      ],
      waText: "Hello, I would like to support Children's Support programs at Grameen Mahila Foundation."
    },
    community: {
      title: 'Community Support',
      badge: 'Caring Aid',
      img: 'images/events/community-event-2.jpg',
      desc: 'We work hand-in-hand with local villagers to celebrate national occasions, care for elders and widows, and build a stronger, united community.',
      points: [
        'Community gatherings and national celebrations with village youth',
        'Nutritional and clothing support for families in distress',
        'Promoting village harmony, health, and mutual assistance',
        'Grassroots volunteer drives led by local community members'
      ],
      waText: 'Hello, I would like to support Community Support initiatives at Grameen Mahila Foundation.'
    }
  };

  const activityModal = document.getElementById('activityModal');
  const activityModalTitle = document.getElementById('activityModalTitle');
  const activityModalBadge = document.getElementById('activityModalBadge');
  const activityModalImg = document.getElementById('activityModalImg');
  const activityModalDesc = document.getElementById('activityModalDesc');
  const activityModalList = document.getElementById('activityModalList');
  const activityModalClose = document.getElementById('activityModalClose');
  const activityModalWaBtn = document.getElementById('activityModalWaBtn');

  const openActivityModal = (key) => {
    const data = activitiesData[key];
    if (!data || !activityModal) return;

    if (activityModalTitle) activityModalTitle.textContent = data.title;
    if (activityModalBadge) activityModalBadge.textContent = data.badge;
    if (activityModalImg) {
      activityModalImg.src = data.img;
      activityModalImg.alt = data.title;
    }
    if (activityModalDesc) activityModalDesc.textContent = data.desc;
    if (activityModalList) {
      activityModalList.innerHTML = data.points.map(pt => `<li>${pt}</li>`).join('');
    }
    if (activityModalWaBtn) {
      activityModalWaBtn.href = `https://wa.me/919723003786?text=${encodeURIComponent(data.waText)}`;
    }

    activityModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeActivityModal = () => {
    if (activityModal) {
      activityModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('[data-activity-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const actKey = btn.getAttribute('data-activity-trigger');
      openActivityModal(actKey);
    });
  });

  if (activityModalClose) {
    activityModalClose.addEventListener('click', closeActivityModal);
  }

  if (activityModal) {
    activityModal.addEventListener('click', (e) => {
      if (e.target === activityModal) closeActivityModal();
    });
  }

  // Keyboard support for Activity Modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activityModal?.classList.contains('active')) {
      closeActivityModal();
    }
  });
});
