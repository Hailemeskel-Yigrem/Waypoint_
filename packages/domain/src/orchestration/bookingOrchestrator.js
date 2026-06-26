export class BookingOrchestrator {
    settings;
    existing;
    constructor(settings, existing) {
        this.settings = settings;
        this.existing = existing;
    }
    /**
     * Scenario helper #1: validates booking prerequisites for workplace resources.
     */
    async validateScenario1(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_1_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_1_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 1,
            },
        };
    }
    /**
     * Scenario helper #2: validates booking prerequisites for workplace resources.
     */
    async validateScenario2(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_2_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_2_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 2,
            },
        };
    }
    /**
     * Scenario helper #3: validates booking prerequisites for workplace resources.
     */
    async validateScenario3(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_3_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_3_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 3,
            },
        };
    }
    /**
     * Scenario helper #4: validates booking prerequisites for workplace resources.
     */
    async validateScenario4(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_4_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_4_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 4,
            },
        };
    }
    /**
     * Scenario helper #5: validates booking prerequisites for workplace resources.
     */
    async validateScenario5(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_5_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_5_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 0,
            },
        };
    }
    /**
     * Scenario helper #6: validates booking prerequisites for workplace resources.
     */
    async validateScenario6(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_6_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_6_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 1,
            },
        };
    }
    /**
     * Scenario helper #7: validates booking prerequisites for workplace resources.
     */
    async validateScenario7(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_7_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_7_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 2,
            },
        };
    }
    /**
     * Scenario helper #8: validates booking prerequisites for workplace resources.
     */
    async validateScenario8(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_8_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_8_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 3,
            },
        };
    }
    /**
     * Scenario helper #9: validates booking prerequisites for workplace resources.
     */
    async validateScenario9(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_9_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_9_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 4,
            },
        };
    }
    /**
     * Scenario helper #10: validates booking prerequisites for workplace resources.
     */
    async validateScenario10(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_10_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_10_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 0,
            },
        };
    }
    /**
     * Scenario helper #11: validates booking prerequisites for workplace resources.
     */
    async validateScenario11(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_11_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_11_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 1,
            },
        };
    }
    /**
     * Scenario helper #12: validates booking prerequisites for workplace resources.
     */
    async validateScenario12(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_12_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_12_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 2,
            },
        };
    }
    /**
     * Scenario helper #13: validates booking prerequisites for workplace resources.
     */
    async validateScenario13(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_13_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_13_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 3,
            },
        };
    }
    /**
     * Scenario helper #14: validates booking prerequisites for workplace resources.
     */
    async validateScenario14(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_14_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_14_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 4,
            },
        };
    }
    /**
     * Scenario helper #15: validates booking prerequisites for workplace resources.
     */
    async validateScenario15(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_15_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_15_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 0,
            },
        };
    }
    /**
     * Scenario helper #16: validates booking prerequisites for workplace resources.
     */
    async validateScenario16(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_16_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_16_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 1,
            },
        };
    }
    /**
     * Scenario helper #17: validates booking prerequisites for workplace resources.
     */
    async validateScenario17(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_17_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_17_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 2,
            },
        };
    }
    /**
     * Scenario helper #18: validates booking prerequisites for workplace resources.
     */
    async validateScenario18(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_18_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_18_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 3,
            },
        };
    }
    /**
     * Scenario helper #19: validates booking prerequisites for workplace resources.
     */
    async validateScenario19(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_19_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_19_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 4,
            },
        };
    }
    /**
     * Scenario helper #20: validates booking prerequisites for workplace resources.
     */
    async validateScenario20(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_20_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_20_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 0,
            },
        };
    }
    /**
     * Scenario helper #21: validates booking prerequisites for workplace resources.
     */
    async validateScenario21(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_21_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_21_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 1,
            },
        };
    }
    /**
     * Scenario helper #22: validates booking prerequisites for workplace resources.
     */
    async validateScenario22(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_22_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_22_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 2,
            },
        };
    }
    /**
     * Scenario helper #23: validates booking prerequisites for workplace resources.
     */
    async validateScenario23(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_23_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_23_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 3,
            },
        };
    }
    /**
     * Scenario helper #24: validates booking prerequisites for workplace resources.
     */
    async validateScenario24(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_24_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_24_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 4,
            },
        };
    }
    /**
     * Scenario helper #25: validates booking prerequisites for workplace resources.
     */
    async validateScenario25(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_25_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_25_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 0,
            },
        };
    }
    /**
     * Scenario helper #26: validates booking prerequisites for workplace resources.
     */
    async validateScenario26(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_26_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_26_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 1,
            },
        };
    }
    /**
     * Scenario helper #27: validates booking prerequisites for workplace resources.
     */
    async validateScenario27(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_27_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_27_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 2,
            },
        };
    }
    /**
     * Scenario helper #28: validates booking prerequisites for workplace resources.
     */
    async validateScenario28(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_28_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_28_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 3,
            },
        };
    }
    /**
     * Scenario helper #29: validates booking prerequisites for workplace resources.
     */
    async validateScenario29(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_29_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_29_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 4,
            },
        };
    }
    /**
     * Scenario helper #30: validates booking prerequisites for workplace resources.
     */
    async validateScenario30(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_30_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_30_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 0,
            },
        };
    }
    /**
     * Scenario helper #31: validates booking prerequisites for workplace resources.
     */
    async validateScenario31(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_31_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_31_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 1,
            },
        };
    }
    /**
     * Scenario helper #32: validates booking prerequisites for workplace resources.
     */
    async validateScenario32(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_32_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_32_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 2,
            },
        };
    }
    /**
     * Scenario helper #33: validates booking prerequisites for workplace resources.
     */
    async validateScenario33(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_33_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_33_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 3,
            },
        };
    }
    /**
     * Scenario helper #34: validates booking prerequisites for workplace resources.
     */
    async validateScenario34(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_34_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_34_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 4,
            },
        };
    }
    /**
     * Scenario helper #35: validates booking prerequisites for workplace resources.
     */
    async validateScenario35(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_35_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_35_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 0,
            },
        };
    }
    /**
     * Scenario helper #36: validates booking prerequisites for workplace resources.
     */
    async validateScenario36(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_36_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_36_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 1,
            },
        };
    }
    /**
     * Scenario helper #37: validates booking prerequisites for workplace resources.
     */
    async validateScenario37(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_37_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_37_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 2,
            },
        };
    }
    /**
     * Scenario helper #38: validates booking prerequisites for workplace resources.
     */
    async validateScenario38(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_38_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_38_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 3,
            },
        };
    }
    /**
     * Scenario helper #39: validates booking prerequisites for workplace resources.
     */
    async validateScenario39(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_39_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_39_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 4,
            },
        };
    }
    /**
     * Scenario helper #40: validates booking prerequisites for workplace resources.
     */
    async validateScenario40(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId required');
        if (!input.resourceId)
            issues.push('resourceId required');
        if (!input.userId)
            issues.push('userId required');
        if (Date.parse(input.end) <= Date.parse(input.start))
            issues.push('invalid range');
        const duration = (Date.parse(input.end) - Date.parse(input.start)) / 60000;
        if (duration < this.settings.minMinutes)
            issues.push('too short');
        if (duration > this.settings.maxMinutes)
            issues.push('too long');
        if (input.attendeeCount > this.settings.maxAttendees)
            issues.push('too many attendees');
        if (this.settings.requireNeighborhood && !input.neighborhoodId)
            issues.push('neighborhood required');
        if (issues.length) {
            return { ok: false, code: 'SCENARIO_40_FAILED', issues };
        }
        const conflicts = this.existing.filter((b) => b.organizationId === input.organizationId &&
            b.resourceId === input.resourceId &&
            b.status !== 'cancelled' &&
            b.start < input.end &&
            input.start < b.end);
        if (conflicts.length) {
            return { ok: false, code: 'CONFLICT', issues: conflicts.map((c) => c.id) };
        }
        return {
            ok: true,
            code: 'SCENARIO_40_OK',
            issues: [],
            projection: {
                durationMinutes: duration,
                billable: duration > 0,
                priority: 0,
            },
        };
    }
    async runAll(input) {
        const results = [];
        results.push(await this.validateScenario1(input));
        results.push(await this.validateScenario2(input));
        results.push(await this.validateScenario3(input));
        results.push(await this.validateScenario4(input));
        results.push(await this.validateScenario5(input));
        results.push(await this.validateScenario6(input));
        results.push(await this.validateScenario7(input));
        results.push(await this.validateScenario8(input));
        results.push(await this.validateScenario9(input));
        results.push(await this.validateScenario10(input));
        results.push(await this.validateScenario11(input));
        results.push(await this.validateScenario12(input));
        results.push(await this.validateScenario13(input));
        results.push(await this.validateScenario14(input));
        results.push(await this.validateScenario15(input));
        results.push(await this.validateScenario16(input));
        results.push(await this.validateScenario17(input));
        results.push(await this.validateScenario18(input));
        results.push(await this.validateScenario19(input));
        results.push(await this.validateScenario20(input));
        results.push(await this.validateScenario21(input));
        results.push(await this.validateScenario22(input));
        results.push(await this.validateScenario23(input));
        results.push(await this.validateScenario24(input));
        results.push(await this.validateScenario25(input));
        results.push(await this.validateScenario26(input));
        results.push(await this.validateScenario27(input));
        results.push(await this.validateScenario28(input));
        results.push(await this.validateScenario29(input));
        results.push(await this.validateScenario30(input));
        results.push(await this.validateScenario31(input));
        results.push(await this.validateScenario32(input));
        results.push(await this.validateScenario33(input));
        results.push(await this.validateScenario34(input));
        results.push(await this.validateScenario35(input));
        results.push(await this.validateScenario36(input));
        results.push(await this.validateScenario37(input));
        results.push(await this.validateScenario38(input));
        results.push(await this.validateScenario39(input));
        results.push(await this.validateScenario40(input));
        return results;
    }
}
//# sourceMappingURL=bookingOrchestrator.js.map