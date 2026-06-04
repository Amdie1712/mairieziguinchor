
const db = require('../db');

class SiteSetting {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM site_settings');
        return rows;
    }

    static async findByGroup(group) {
        const [rows] = await db.query('SELECT * FROM site_settings WHERE setting_group = ?', [group]);
        return rows;
    }

    static async update(key, value) {
        await db.query('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
        return { key, value };
    }

    static async bulkUpdate(settings) {
        // settings is { key: value, ... }
        for (const [key, value] of Object.entries(settings)) {
            await this.update(key, value);
        }
        return true;
    }
}

module.exports = SiteSetting;
