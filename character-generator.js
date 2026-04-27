// === Character Generator Module ===

const CharacterGenerator = {
  categories: {
    gender: {
      label: 'Gender',
      options: ['Male', 'Female', 'Non-binary', 'Androgynous', 'Genderfluid', 'Agender', 'Bigender', 'Genderqueer']
    },
    age: {
      label: 'Age Range',
      options: ['Child (5-12)', 'Teen (13-19)', 'Young Adult (20-30)', 'Adult (31-45)', 'Middle-aged (46-60)', 'Elderly (61+)']
    },
    ethnicity: {
      label: 'Ethnicity',
      options: ['Caucasian', 'African', 'East Asian', 'Southeast Asian', 'South Asian', 'Latino', 'Middle Eastern', 'Native American', 'Pacific Islander', 'Mixed Heritage']
    },
    build: {
      label: 'Body Build',
      options: ['Slim', 'Athletic', 'Muscular', 'Stocky', 'Curvy', 'Petite', 'Tall & Lanky', 'Broad-shouldered', 'Slender', 'Heavy-set']
    },
    hair: {
      label: 'Hair',
      options: ['Short cropped', 'Shoulder-length waves', 'Long flowing', 'Curly afro', 'Braided', 'Buzz cut', 'Pixie cut', 'Bun/ponytail', 'Wild & unkempt', 'Neatly combed', 'Bald', 'Mohawk']
    },
    hairColor: {
      label: 'Hair Color',
      options: ['Black', 'Dark brown', 'Light brown', 'Blonde', 'Red/Auburn', 'Salt & pepper', 'White', 'Blue-black', 'Platinum', 'Copper']
    },
    eyes: {
      label: 'Eyes',
      options: ['Sharp green', 'Warm brown', 'Steel blue', 'Hazel', 'Dark amber', 'Gray', 'Violet', 'Deep black', 'Light blue', 'Golden']
    },
    skin: {
      label: 'Skin Tone',
      options: ['Fair', 'Light', 'Olive', 'Tan', 'Medium brown', 'Dark brown', 'Deep ebony', 'Warm golden', 'Pale porcelain', 'Rich mahogany']
    },
    distinguishing: {
      label: 'Distinguishing Features',
      options: ['Faint scar across cheek', 'Freckles across nose', 'Tattoo on forearm', 'Silver ring in eyebrow', 'Mole near lip', "Crow's feet from smiling", 'Calloused hands', 'Pierced ears', 'Dimpled chin', 'Prominent jawline', 'High cheekbones', 'Weathered skin']
    },
    clothing: {
      label: 'Typical Clothing',
      options: ['Practical workwear', 'Formal attire', 'Casual streetwear', 'Layered bohemian', 'Military-inspired', 'Vintage-inspired', 'Minimalist', 'Eclectic mix', 'Dark & moody', 'Bright & colorful']
    },
    personality: {
      label: 'Personality',
      options: ['Confident & bold', 'Shy & reserved', 'Witty & sarcastic', 'Gentle & empathetic', 'Ambitious & driven', 'Laid-back & easygoing', 'Intense & focused', 'Playful & mischievous', 'Thoughtful & introspective', 'Fierce & independent']
    },
    mannerisms: {
      label: 'Mannerisms',
      options: ['Fidgets with hands when nervous', 'Speaks slowly & deliberately', 'Has a warm, infectious laugh', 'Taps foot when impatient', 'Maintains intense eye contact', 'Smirks at inappropriate times', 'Nods thoughtfully while listening', 'Cracks knuckles before acting', 'Hums softly when deep in thought', 'Gestures expressively while talking']
    },
    background: {
      label: 'Background',
      options: ['Street-smart orphan', 'Former academic', 'Military veteran', 'Artistic free spirit', 'Corporate refugee', 'Small-town transplant', 'Immigrant seeking opportunity', 'Wealthy heir', 'Self-made entrepreneur', 'Wanderer with no fixed home']
    },
    occupation: {
      label: 'Occupation',
      options: ['Artist', 'Engineer', 'Teacher', 'Doctor', 'Musician', 'Chef', 'Detective', 'Writer', 'Trader/Merchant', 'Healer', 'Guard/Soldier', 'Scholar', 'Mechanic', 'Explorer']
    },
    timeperiod: {
      label: 'Time Period',
      options: ['Modern day', 'Near future', 'Victorian era', 'Medieval', 'Renaissance', 'Wild West', '1920s', '1980s', 'Ancient times', 'Post-apocalyptic', 'Fantasy realm (timeless)', 'Cyberpunk future']
    },
    demeanor: {
      label: 'Overall Demeanor',
      options: ['Mysterious & enigmatic', 'Warm & approachable', 'Intimidating & stern', 'Cheerful & optimistic', 'Brooding & melancholic', 'Calming & serene', 'Energetic & restless', 'Calculating & sharp', 'Noble & dignified', 'Rebellious & defiant']
    }
  },

  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  generate(enabledCategories = null) {
    const cats = enabledCategories || Object.keys(this.categories);
    const result = {};

    cats.forEach(key => {
      if (this.categories[key]) {
        result[key] = this.randomFrom(this.categories[key].options);
      }
    });

    result.name = this.generateName(result.gender, result.ethnicity, result.timeperiod);
    result.description = this.buildDescription(result);

    return result;
  },

  generateName(gender, ethnicity, timeperiod) {
    const names = {
      male: {
        caucasian: ['Ethan', 'Marcus', 'Finn', 'Oliver', 'Liam', 'Noah', 'James', 'Lucas'],
        african: ['Kwame', 'Tariq', 'Jabari', 'Amari', 'Kofi', 'Malik', 'Imran', 'Zane'],
        'east asian': ['Kenji', 'Wei', 'Min-ho', 'Tao', 'Hiro', 'Jun', 'Ryu', 'Soren'],
        'south asian': ['Arjun', 'Ravi', 'Kiran', 'Dev', 'Vikram', 'Aryan', 'Rohan', 'Kabir'],
        latino: ['Mateo', 'Diego', 'Carlos', 'Santiago', 'Leo', 'Rafael', 'Luis', 'Javier'],
        default: ['Alex', 'Jordan', 'Rowan', 'Sage', 'Ellis', 'Quinn', 'Reid', 'Blake']
      },
      female: {
        caucasian: ['Elena', 'Clara', 'Iris', 'Luna', 'Ava', 'Maeve', 'Freya', 'Willow'],
        african: ['Nia', 'Amara', 'Zara', 'Fatima', 'Aisha', 'Nala', 'Imani', 'Sade'],
        'east asian': ['Mei', 'Yuki', 'Soo-jin', 'Ling', 'Hana', 'Sakura', 'Ji-woo', 'Xin'],
        'south asian': ['Priya', 'Ananya', 'Meera', 'Lakshmi', 'Kavya', 'Isha', 'Riya', 'Zara'],
        latino: ['Sofia', 'Isabella', 'Valentina', 'Camila', 'Lucia', 'Rosa', 'Carmen', 'Esperanza'],
        default: ['Avery', 'Taylor', 'Morgan', 'Skyler', 'Dakota', 'River', 'Emery', 'Finley']
      },
      default: {
        default: ['Avery', 'Quinn', 'Sage', 'Rowan', 'Ellis', 'Blake', 'Reid', 'Emery', 'Skyler', 'Morgan']
      }
    };

    const genderKey = (gender || '').toLowerCase().includes('male') ? 'male' :
                      (gender || '').toLowerCase().includes('female') ? 'female' : 'default';
    const ethKey = (ethnicity || '').toLowerCase().split(' ')[0];
    const pool = names[genderKey] ? (names[genderKey][ethKey] || names[genderKey].default) : names.default.default;
    return this.randomFrom(pool);
  },

  buildDescription(char) {
    const parts = [];
    const physical = [];

    if (char.age) physical.push(char.age.split(' ')[0].toLowerCase() + ' ' + (char.gender || 'person'));
    if (char.ethnicity) physical.push(char.ethnicity.toLowerCase() + ' heritage');
    if (char.build) physical.push(char.build.toLowerCase() + ' build');
    if (char.skin) physical.push(char.skin.toLowerCase() + ' complexion');
    if (char.hair && char.hairColor) physical.push(char.hairColor.toLowerCase() + ' ' + char.hair.toLowerCase());
    else if (char.hair) physical.push(char.hair.toLowerCase());
    else if (char.hairColor) physical.push(char.hairColor.toLowerCase() + ' hair');
    if (char.eyes) physical.push(char.eyes.toLowerCase() + ' eyes');
    if (char.distinguishing) physical.push(char.distinguishing.toLowerCase());

    if (physical.length > 0) parts.push(physical.join(', '));
    if (char.clothing) parts.push('Typically dressed in ' + char.clothing.toLowerCase());
    if (char.personality) parts.push(char.personality.toLowerCase() + ' demeanor');
    if (char.mannerisms) parts.push(char.mannerisms.toLowerCase());

    if (char.background && char.occupation) {
      parts.push('A ' + char.background.toLowerCase() + ', now working as ' + char.occupation.toLowerCase());
    } else if (char.background) {
      parts.push(char.background.toLowerCase());
    } else if (char.occupation) {
      parts.push('Works as ' + char.occupation.toLowerCase());
    }

    if (char.demeanor) parts.push('Overall presence: ' + char.demeanor.toLowerCase());

    return parts.length > 0 ? parts.join('. ') + '.' : 'A character waiting to be defined.';
  }
};

function openCharacterGeneratorModal() {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = '\u26a1 Character Generator';

  let html = '<div class="generator-header">' +
    '<p class="hint">Toggle categories on/off, then generate. Each roll picks randomly from curated options.</p>' +
    '<div class="generator-controls">' +
    '<button class="btn-secondary" onclick="toggleAllGeneratorCategories(true)">Enable All</button>' +
    '<button class="btn-secondary" onclick="toggleAllGeneratorCategories(false)">Disable All</button>' +
    '<button class="btn-primary" onclick="generateAndPreview()">\u26a1 Generate</button>' +
    '</div></div><div class="generator-categories">';

  Object.keys(CharacterGenerator.categories).forEach(function(key) {
    var cat = CharacterGenerator.categories[key];
    html += '<div class="generator-category">' +
      '<label class="generator-toggle">' +
      '<input type="checkbox" class="gen-cat-check" data-category="' + key + '" checked>' +
      '<span class="toggle-slider"></span>' +
      '<span class="toggle-label">' + cat.label + '</span>' +
      '</label></div>';
  });

  html += '</div>' +
    '<div class="generator-preview" id="generator-preview" style="display:none;">' +
    '<h4>Generated Character</h4>' +
    '<div id="generator-preview-content"></div>' +
    '<div class="generator-preview-actions">' +
    '<button class="btn-secondary" onclick="generateAndPreview()">\ud83d\udd04 Re-roll</button>' +
    '<button class="btn-primary" onclick="saveGeneratedCharacter()">\ud83d\udcbe Save Character</button>' +
    '</div></div>';

  body.innerHTML = html;
  modal.style.display = 'flex';
}

function toggleAllGeneratorCategories(state) {
  document.querySelectorAll('.gen-cat-check').forEach(function(cb) { cb.checked = state; });
}

function generateAndPreview() {
  var enabled = [];
  document.querySelectorAll('.gen-cat-check:checked').forEach(function(cb) {
    enabled.push(cb.dataset.category);
  });

  if (enabled.length === 0) {
    showToast('Enable at least one category!');
    return;
  }

  var char = CharacterGenerator.generate(enabled);
  window._generatedCharacter = char;

  var preview = document.getElementById('generator-preview');
  var content = document.getElementById('generator-preview-content');
  preview.style.display = 'block';

  var detailHtml = '<h3 style="color:var(--accent);margin-bottom:0.5rem;">' + escapeHtml(char.name) + '</h3>';
  detailHtml += '<div class="gen-detail-grid">';

  enabled.forEach(function(key) {
    var cat = CharacterGenerator.categories[key];
    if (cat && char[key]) {
      detailHtml += '<div class="gen-detail-item">' +
        '<span class="gen-detail-label">' + cat.label + ':</span>' +
        '<span class="gen-detail-value">' + escapeHtml(char[key]) + '</span>' +
        '</div>';
    }
  });

  detailHtml += '</div>';
  detailHtml += '<div class="gen-description"><strong>Description:</strong> ' + escapeHtml(char.description) + '</div>';

  content.innerHTML = detailHtml;
  preview.scrollIntoView({ behavior: 'smooth' });
}

function saveGeneratedCharacter() {
  if (!window._generatedCharacter) {
    showToast('Generate a character first!');
    return;
  }

  var char = window._generatedCharacter;
  var characters = Store.get('characters', []);
  characters.push({
    id: generateId('char'),
    name: char.name,
    description: char.description,
    generated: true,
    attributes: Object.assign({}, char)
  });

  Store.set('characters', characters);
  closeModal();
  renderCharacterList();
  delete window._generatedCharacter;
  showToast('Character saved! \u26a1');
}
