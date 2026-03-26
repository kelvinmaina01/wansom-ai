import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MatterManager {
  constructor(mattersDir = path.join(__dirname, 'matters')) {
    this.mattersDir = mattersDir;
    this.registryPath = path.join(this.mattersDir, 'REGISTRY.json');
    this.matters = [];
    this._loadMatters();
  }

  _loadMatters() {
    try {
      if (fs.existsSync(this.registryPath)) {
        this.matters = JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
      } else {
        if (!fs.existsSync(this.mattersDir)) {
          fs.mkdirSync(this.mattersDir, { recursive: true });
        }
        this.matters = [];
        this._saveMatters();
      }
    } catch (e) {
      logger.error('Error loading matters registry:', e.message);
      this.matters = [];
    }
  }

  _saveMatters() {
    try {
      fs.writeFileSync(this.registryPath, JSON.stringify(this.matters, null, 2));
    } catch (e) {
      logger.error('Error saving matters registry:', e.message);
    }
  }

  registerMatter(data) {
    const newMatter = {
      id: `MATTER-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [],
      ...data
    };
    this.matters.push(newMatter);
    this._saveMatters();
    return newMatter;
  }

  getMatter(matterId) {
    return this.matters.find(m => m.id === matterId);
  }

  updateMatter(matterId, updates) {
    const index = this.matters.findIndex(m => m.id === matterId);
    if (index !== -1) {
      this.matters[index] = {
        ...this.matters[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this._saveMatters();
      return this.matters[index];
    }
    return null;
  }

  calculateDeadline(startDate, days, businessDays = false) {
    const date = new Date(startDate);
    if (!businessDays) {
      date.setDate(date.getDate() + days);
    } else {
      let count = 0;
      while (count < days) {
        date.setDate(date.getDate() + 1);
        const day = date.getDay();
        if (day !== 0 && day !== 6) count++;
      }
    }
    return date.toISOString().split('T')[0];
  }

  suggestNextStep(matter) {
    if (!matter || !matter.type) return null;

    const type = matter.type.toLowerCase();
    const history = matter.history || [];

    // Simple Rule-Based Suggestion Engine
    if (type === 'litigation') {
      if (history.length === 0) return { action: 'Draft Plaint', deadline: null };
      
      const lastAction = history[history.length - 1].action;
      if (lastAction === 'Draft Plaint') {
        return { 
          action: 'Draft Verifying Affidavit', 
          deadline: this.calculateDeadline(new Date(), 0) 
        };
      }
      if (lastAction === 'Service of Summons') {
        return { 
          action: 'File Affidavit of Service', 
          deadline: this.calculateDeadline(new Date(), 3) 
        };
      }
    }

    if (type === 'conveyancing') {
      if (history.length === 0) return { action: 'Draft Agreement for Sale', deadline: null };
    }

    return null;
  }
}

export const matterManager = new MatterManager();
