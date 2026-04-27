// === Prompt Forge - Main Application ===

// Data Store
const Store = {
  get(key, fallback = null) {
    try {
      const data = localStorage.getItem(`promptforge_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error('Store get error:', e);
      return fallback;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(`promptforge_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Store set error:', e);
    }
  },
  
  getAll() {
    return {
      prompts: this.get('prompts', []),
      characters: this.get('characters', []),
      scenes: this.get('scenes', []),
      styles: this.get('styles', []),
      timeperiods: this.get('timeperiods', []),
      moods: this.get('moods', [])
    };
  },
  
  clearAll() {
    const keys = ['prompts', 'characters', 'scenes', 'styles', 'timeperiods', 'moods'];
    keys.forEach(key => localStorage.removeItem(`promptforge_${key}`));
  }
};

// Initialize with sample data if empty
function initSampleData() {
  if (Store.get('characters', []).length === 0) {
    Store.set('characters', [
      { id: 'char_1', name: 'Elena', description: 'A young woman with auburn hair, sharp green eyes, and a determined expression. Mid-20s, athletic build, often wears practical clothing.' },
      { id: 'char_2', name: 'Marcus', description: 'An older man in his 50s with a grizzled beard, weathered face, and kind eyes. Wears a long coat and carries himself with quiet authority.' }
    ]);
    
    Store.set('scenes', [
      { id: 'scene_1', name: 'Abandoned Factory', description: 'A decaying industrial complex with rusted machinery, broken windows, and vines creeping up concrete walls. Dusty light filters through cracks.' },
      { id: 'scene_2', name: 'Victorian Street', description: 'A cobblestone street lined with gas lamps and ornate brick buildings. Fog rolls through the narrow alleyways.' }
    ]);
    
    Store.set('styles', [
      { id: 'style_1', name: 'Cinematic Realism', description: 'Photorealistic, dramatic lighting, shallow depth of field, film grain, anamorphic lens flares' },
      { id: 'style_2', name: 'Oil Painting', description: 'Rich oil painting style, visible brushstrokes, warm color palette, classical composition, museum quality' }
    ]);
    
    Store.set('timeperiods', [
      { id: 'tp_1', name: 'Modern Day', description: 'Contemporary setting, modern clothing and technology' },
      { id: 'tp_2', name: 'Victorian Era', description: '1837-1901, gas lamps, horse-drawn carriages, formal attire' }
    ]);
    
    Store.set('moods', [
      { id: 'mood_1', name: 'Mysterious', description: 'Shadows, fog, uncertainty, suspenseful atmosphere' },
      { id: 'mood_2', name: 'Hopeful', description: 'Warm light, golden hour, sense of possibility and renewal' }
    ]);
    
    Store.set('prompts', [
      {
        id: 'prompt_1',
        title: 'Elena in the Factory',
        content: '{character} standing in {scene}, {timeperiod} era, {style} style, {mood} atmosphere',
        tags: ['keyframe', 'character intro'],
        createdAt: new Date().toISOString()
      }
    ]);
  }
}

// UI Helpers
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}

// Tab Navigation
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetId = tab.dataset.tab;
      document.getElementById(targetId).classList.add('active');
      
      // Refresh data when switching tabs
      if (targetId === 'library') renderPromptList();
      if (targetId === 'characters') renderCharacterList();
      if (targetId === 'scenes') renderSceneList();
      if (targetId === 'styles') renderStyleList();
    });
  });
}

// Prompt Library
function renderPromptList(search = '', tagFilter = '') {
  const prompts = Store.get('prompts', []);
  const list = document.getElementById('prompt-list');
  
  let filtered = prompts;
  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(lower) || 
      p.content.toLowerCase().includes(lower)
    );
  }
  if (tagFilter) {
    filtered = filtered.filter(p => p.tags && p.tags.includes(tagFilter));
  }
  
  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No prompts yet. Create one in the Builder tab!</p></div>';
    return;
  }
  
  list.innerHTML = filtered.map(prompt => `
    <div class="card" data-id="${prompt.id}">
      <h4>${escapeHtml(prompt.title || 'Untitled')}</h4>
      <p>${escapeHtml(prompt.content.substring(0, 120))}${prompt.content.length > 120 ? '...' : ''}</p>
      ${prompt.tags ? `<div class="tags">${prompt.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      <div class="card-actions">
        <button class="btn-secondary" onclick="copyPrompt('${prompt.id}')">Copy</button>
        <button class="btn-secondary" onclick="editPrompt('${prompt.id}')">Edit</button>
        <button class="btn-danger" onclick="deletePrompt('${prompt.id}')">Delete</button>
      </div>
    </div>
  `).join('');
  
  updateTagFilter();
}

function updateTagFilter() {
  const prompts = Store.get('prompts', []);
  const allTags = new Set();
  prompts.forEach(p => {
    if (p.tags) p.tags.forEach(t => allTags.add(t));
  });
  
  const select = document.getElementById('tag-filter');
  const current = select.value;
  select.innerHTML = '<option value="">All Tags</option>' + 
    Array.from(allTags).map(tag => `<option value="${escapeHtml(tag)}" ${tag === current ? 'selected' : ''}>${escapeHtml(tag)}</option>`).join('');
}

function copyPrompt(id) {
  const prompts = Store.get('prompts', []);
  const prompt = prompts.find(p => p.id === id);
  if (prompt) {
    const resolved = resolveVariables(prompt.content);
    navigator.clipboard.writeText(resolved).then(() => {
      showToast('Prompt copied to clipboard!');
    });
  }
}

function editPrompt(id) {
  const prompts = Store.get('prompts', []);
  const prompt = prompts.find(p => p.id === id);
  if (prompt) {
    // Switch to builder tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="builder"]').classList.add('active');
    document.getElementById('builder').classList.add('active');
    
    document.getElementById('prompt-text').value = prompt.content;
    document.getElementById('prompt-title').value = prompt.title;
    document.getElementById('prompt-tags').value = (prompt.tags || []).join(', ');
    document.getElementById('save-fields').style.display = 'flex';
    document.getElementById('save-prompt-btn').dataset.editId = id;
    updateResolvedPrompt();
  }
}

function deletePrompt(id) {
  if (!confirm('Delete this prompt?')) return;
  let prompts = Store.get('prompts', []);
  prompts = prompts.filter(p => p.id !== id);
  Store.set('prompts', prompts);
  renderPromptList();
  showToast('Prompt deleted');
}

// Character Management
function renderCharacterList() {
  const characters = Store.get('characters', []);
  const list = document.getElementById('character-list');
  
  if (characters.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No characters yet. Add one to get started!</p></div>';
    return;
  }
  
  list.innerHTML = characters.map(char => `
    <div class="card">
      ${char.generated ? '<span class="char-badge">⚡ Generated</span>' : ''}
      <h4>${escapeHtml(char.name)}</h4>
      <p>${escapeHtml(char.description.substring(0, 100))}${char.description.length > 100 ? '...' : ''}</p>
      <div class="card-actions">
        <button class="btn-secondary" onclick="editCharacter('${char.id}')">Edit</button>
        <button class="btn-danger" onclick="deleteCharacter('${char.id}')">Delete</button>
      </div>
    </div>
  `).join('');
  
  updateVariableDropdowns();
}

function openCharacterModal(character = null) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  
  title.textContent = character ? 'Edit Character' : 'Add Character';
  body.innerHTML = `
    <div>
      <label>Name</label>
      <input type="text" id="char-name" value="${character ? escapeHtml(character.name) : ''}" placeholder="Character name...">
    </div>
    <div>
      <label>Description</label>
      <textarea id="char-description" placeholder="Physical appearance, personality, typical clothing...">${character ? escapeHtml(character.description) : ''}</textarea>
    </div>
    <button class="btn-primary" onclick="saveCharacter('${character ? character.id : ''}')">${character ? 'Update' : 'Add'} Character</button>
  `;
  
  modal.style.display = 'flex';
}

function saveCharacter(id) {
  const name = document.getElementById('char-name').value.trim();
  const description = document.getElementById('char-description').value.trim();
  
  if (!name) {
    showToast('Name is required');
    return;
  }
  
  let characters = Store.get('characters', []);
  
  if (id) {
    const idx = characters.findIndex(c => c.id === id);
    if (idx !== -1) {
      characters[idx] = { ...characters[idx], name, description };
    }
  } else {
    characters.push({ id: generateId('char'), name, description });
  }
  
  Store.set('characters', characters);
  closeModal();
  renderCharacterList();
  showToast(id ? 'Character updated!' : 'Character added!');
}

function editCharacter(id) {
  const characters = Store.get('characters', []);
  const character = characters.find(c => c.id === id);
  if (character) openCharacterModal(character);
}

function deleteCharacter(id) {
  if (!confirm('Delete this character?')) return;
  let characters = Store.get('characters', []);
  characters = characters.filter(c => c.id !== id);
  Store.set('characters', characters);
  renderCharacterList();
  showToast('Character deleted');
}

// Scene Management
function renderSceneList() {
  const scenes = Store.get('scenes', []);
  const list = document.getElementById('scene-list');
  
  if (scenes.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No scenes yet. Add one to get started!</p></div>';
    return;
  }
  
  list.innerHTML = scenes.map(scene => `
    <div class="card">
      <h4>${escapeHtml(scene.name)}</h4>
      <p>${escapeHtml(scene.description.substring(0, 100))}${scene.description.length > 100 ? '...' : ''}</p>
      <div class="card-actions">
        <button class="btn-secondary" onclick="editScene('${scene.id}')">Edit</button>
        <button class="btn-danger" onclick="deleteScene('${scene.id}')">Delete</button>
      </div>
    </div>
  `).join('');
  
  updateVariableDropdowns();
}

function openSceneModal(scene = null) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  
  title.textContent = scene ? 'Edit Scene' : 'Add Scene';
  body.innerHTML = `
    <div>
      <label>Name</label>
      <input type="text" id="scene-name" value="${scene ? escapeHtml(scene.name) : ''}" placeholder="Scene name...">
    </div>
    <div>
      <label>Description</label>
      <textarea id="scene-description" placeholder="Location details, atmosphere, lighting...">${scene ? escapeHtml(scene.description) : ''}</textarea>
    </div>
    <button class="btn-primary" onclick="saveScene('${scene ? scene.id : ''}')">${scene ? 'Update' : 'Add'} Scene</button>
  `;
  
  modal.style.display = 'flex';
}

function saveScene(id) {
  const name = document.getElementById('scene-name').value.trim();
  const description = document.getElementById('scene-description').value.trim();
  
  if (!name) {
    showToast('Name is required');
    return;
  }
  
  let scenes = Store.get('scenes', []);
  
  if (id) {
    const idx = scenes.findIndex(s => s.id === id);
    if (idx !== -1) {
      scenes[idx] = { ...scenes[idx], name, description };
    }
  } else {
    scenes.push({ id: generateId('scene'), name, description });
  }
  
  Store.set('scenes', scenes);
  closeModal();
  renderSceneList();
  showToast(id ? 'Scene updated!' : 'Scene added!');
}

function editScene(id) {
  const scenes = Store.get('scenes', []);
  const scene = scenes.find(s => s.id === id);
  if (scene) openSceneModal(scene);
}

function deleteScene(id) {
  if (!confirm('Delete this scene?')) return;
  let scenes = Store.get('scenes', []);
  scenes = scenes.filter(s => s.id !== id);
  Store.set('scenes', scenes);
  renderSceneList();
  showToast('Scene deleted');
}

// Style Management
function renderStyleList() {
  const styles = Store.get('styles', []);
  const list = document.getElementById('style-list');
  
  if (styles.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No styles yet. Add one to get started!</p></div>';
    return;
  }
  
  list.innerHTML = styles.map(style => `
    <div class="card">
      <h4>${escapeHtml(style.name)}</h4>
      <p>${escapeHtml(style.description.substring(0, 100))}${style.description.length > 100 ? '...' : ''}</p>
      <div class="card-actions">
        <button class="btn-secondary" onclick="editStyle('${style.id}')">Edit</button>
        <button class="btn-danger" onclick="deleteStyle('${style.id}')">Delete</button>
      </div>
    </div>
  `).join('');
  
  updateVariableDropdowns();
}

function openStyleModal(style = null) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  
  title.textContent = style ? 'Edit Style' : 'Add Style';
  body.innerHTML = `
    <div>
      <label>Name</label>
      <input type="text" id="style-name" value="${style ? escapeHtml(style.name) : ''}" placeholder="Style name...">
    </div>
    <div>
      <label>Description</label>
      <textarea id="style-description" placeholder="Visual style details, artistic references...">${style ? escapeHtml(style.description) : ''}</textarea>
    </div>
    <button class="btn-primary" onclick="saveStyle('${style ? style.id : ''}')">${style ? 'Update' : 'Add'} Style</button>
  `;
  
  modal.style.display = 'flex';
}

function saveStyle(id) {
  const name = document.getElementById('style-name').value.trim();
  const description = document.getElementById('style-description').value.trim();
  
  if (!name) {
    showToast('Name is required');
    return;
  }
  
  let styles = Store.get('styles', []);
  
  if (id) {
    const idx = styles.findIndex(s => s.id === id);
    if (idx !== -1) {
      styles[idx] = { ...styles[idx], name, description };
    }
  } else {
    styles.push({ id: generateId('style'), name, description });
  }
  
  Store.set('styles', styles);
  closeModal();
  renderStyleList();
  showToast(id ? 'Style updated!' : 'Style added!');
}

function editStyle(id) {
  const styles = Store.get('styles', []);
  const style = styles.find(s => s.id === id);
  if (style) openStyleModal(style);
}

function deleteStyle(id) {
  if (!confirm('Delete this style?')) return;
  let styles = Store.get('styles', []);
  styles = styles.filter(s => s.id !== id);
  Store.set('styles', styles);
  renderStyleList();
  showToast('Style deleted');
}

// Variable Dropdowns
function updateVariableDropdowns() {
  const characters = Store.get('characters', []);
  const scenes = Store.get('scenes', []);
  const styles = Store.get('styles', []);
  const timeperiods = Store.get('timeperiods', []);
  const moods = Store.get('moods', []);
  
  populateDropdown('var-character', characters, 'Select character...');
  populateDropdown('var-scene', scenes, 'Select scene...');
  populateDropdown('var-style', styles, 'Select style...');
  populateDropdown('var-timeperiod', timeperiods, 'Select period...');
  populateDropdown('var-mood', moods, 'Select mood...');
}

function populateDropdown(id, items, placeholder) {
  const select = document.getElementById(id);
  const current = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>` + 
    items.map(item => `<option value="${item.id}" data-desc="${escapeHtml(item.description)}">${escapeHtml(item.name)}</option>`).join('');
  select.value = current;
}

// Variable Resolution
function resolveVariables(text) {
  const characters = Store.get('characters', []);
  const scenes = Store.get('scenes', []);
  const styles = Store.get('styles', []);
  const timeperiods = Store.get('timeperiods', []);
  const moods = Store.get('moods', []);
  
  const allItems = [
    ...characters.map(c => ({ id: c.id, desc: c.description })),
    ...scenes.map(s => ({ id: s.id, desc: s.description })),
    ...styles.map(s => ({ id: s.id, desc: s.description })),
    ...timeperiods.map(t => ({ id: t.id, desc: t.description })),
    ...moods.map(m => ({ id: m.id, desc: m.description }))
  ];
  
  // Replace {variable_name} with selected item's description
  const vars = ['character', 'scene', 'style', 'timeperiod', 'mood'];
  let resolved = text;
  
  vars.forEach(varName => {
    const select = document.getElementById(`var-${varName}`);
    if (select && select.value) {
      const selectedItem = allItems.find(item => item.id === select.value);
      if (selectedItem) {
        resolved = resolved.replace(new RegExp(`\\{${varName}\\}`, 'gi'), selectedItem.desc);
      }
    }
  });
  
  return resolved;
}

function updateResolvedPrompt() {
  const text = document.getElementById('prompt-text').value;
  const resolved = resolveVariables(text);
  document.getElementById('resolved-prompt').textContent = resolved;
}

// Save Prompt
function savePrompt() {
  const content = document.getElementById('prompt-text').value.trim();
  const title = document.getElementById('prompt-title').value.trim();
  const tagsStr = document.getElementById('prompt-tags').value.trim();
  const editId = document.getElementById('save-prompt-btn').dataset.editId;
  
  if (!content) {
    showToast('Prompt content is required');
    return;
  }
  
  let prompts = Store.get('prompts', []);
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];
  
  if (editId) {
    const idx = prompts.findIndex(p => p.id === editId);
    if (idx !== -1) {
      prompts[idx] = { ...prompts[idx], title: title || 'Untitled', content, tags };
    }
    delete document.getElementById('save-prompt-btn').dataset.editId;
  } else {
    prompts.push({
      id: generateId('prompt'),
      title: title || 'Untitled',
      content,
      tags,
      createdAt: new Date().toISOString()
    });
  }
  
  Store.set('prompts', prompts);
  document.getElementById('save-fields').style.display = 'none';
  document.getElementById('prompt-title').value = '';
  document.getElementById('prompt-tags').value = '';
  showToast(editId ? 'Prompt updated!' : 'Prompt saved!');
}

// Export/Import
function exportAll() {
  const data = Store.getAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prompt-forge-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported!');
}

function importAll(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.prompts) Store.set('prompts', data.prompts);
      if (data.characters) Store.set('characters', data.characters);
      if (data.scenes) Store.set('scenes', data.scenes);
      if (data.styles) Store.set('styles', data.styles);
      if (data.timeperiods) Store.set('timeperiods', data.timeperiods);
      if (data.moods) Store.set('moods', data.moods);
      renderPromptList();
      updateVariableDropdowns();
      showToast('Data imported successfully!');
    } catch (err) {
      showToast('Invalid file format');
    }
  };
  reader.readAsText(file);
}

function clearAll() {
  if (!confirm('Are you sure? This will delete ALL your data.')) return;
  if (!confirm('Really? This cannot be undone.')) return;
  Store.clearAll();
  renderPromptList();
  updateVariableDropdowns();
  showToast('All data cleared');
}

// Modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// HTML Escape
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initSampleData();
  initTabs();
  renderPromptList();
  updateVariableDropdowns();
  
  // Search & Filter
  document.getElementById('search-input').addEventListener('input', (e) => {
    renderPromptList(e.target.value, document.getElementById('tag-filter').value);
  });
  
  document.getElementById('tag-filter').addEventListener('change', (e) => {
    renderPromptList(document.getElementById('search-input').value, e.target.value);
  });
  
  // New Prompt
  document.getElementById('new-prompt-btn').addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="builder"]').classList.add('active');
    document.getElementById('builder').classList.add('active');
    document.getElementById('prompt-text').value = '';
    document.getElementById('resolved-prompt').textContent = '';
    document.getElementById('save-fields').style.display = 'none';
    delete document.getElementById('save-prompt-btn').dataset.editId;
  });
  
  // Copy Prompt
  document.getElementById('copy-prompt-btn').addEventListener('click', () => {
    const resolved = resolveVariables(document.getElementById('prompt-text').value);
    navigator.clipboard.writeText(resolved).then(() => {
      showToast('Prompt copied to clipboard!');
    });
  });
  
  // Save Prompt
  document.getElementById('save-prompt-btn').addEventListener('click', () => {
    const fields = document.getElementById('save-fields');
    if (fields.style.display === 'none') {
      fields.style.display = 'flex';
    } else {
      savePrompt();
    }
  });
  
  // Prompt text change → update resolved
  document.getElementById('prompt-text').addEventListener('input', updateResolvedPrompt);
  
  // Variable dropdown changes → update resolved
  ['var-character', 'var-scene', 'var-style', 'var-timeperiod', 'var-mood'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateResolvedPrompt);
  });
  
  // Character CRUD
  document.getElementById('new-character-btn').addEventListener('click', () => openCharacterModal());
  document.getElementById('generate-character-btn').addEventListener('click', () => openCharacterGeneratorModal());
  document.getElementById('generate-character-btn').addEventListener('click', () => openCharacterGeneratorModal());
  
  // Scene CRUD
  document.getElementById('new-scene-btn').addEventListener('click', () => openSceneModal());
  
  // Style CRUD
  document.getElementById('new-style-btn').addEventListener('click', () => openStyleModal());
  
  // Settings
  document.getElementById('export-all-btn').addEventListener('click', exportAll);
  document.getElementById('import-all-btn').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  document.getElementById('import-file').addEventListener('change', (e) => {
    if (e.target.files[0]) importAll(e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('clear-all-btn').addEventListener('click', clearAll);
  
  // Modal close
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });
  
  // Keyboard shortcut: Escape closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
