export class SpacePlanningEngine {
    processSpacePlan1(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_1_FAIL' : 'SpacePlan_1_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processSpacePlan2(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_2_FAIL' : 'SpacePlan_2_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processSpacePlan3(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_3_FAIL' : 'SpacePlan_3_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processSpacePlan4(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_4_FAIL' : 'SpacePlan_4_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processSpacePlan5(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_5_FAIL' : 'SpacePlan_5_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processSpacePlan6(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_6_FAIL' : 'SpacePlan_6_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processSpacePlan7(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_7_FAIL' : 'SpacePlan_7_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processSpacePlan8(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_8_FAIL' : 'SpacePlan_8_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processSpacePlan9(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_9_FAIL' : 'SpacePlan_9_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processSpacePlan10(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_10_FAIL' : 'SpacePlan_10_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processSpacePlan11(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_11_FAIL' : 'SpacePlan_11_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processSpacePlan12(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_12_FAIL' : 'SpacePlan_12_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processSpacePlan13(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_13_FAIL' : 'SpacePlan_13_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processSpacePlan14(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_14_FAIL' : 'SpacePlan_14_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processSpacePlan15(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_15_FAIL' : 'SpacePlan_15_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processSpacePlan16(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_16_FAIL' : 'SpacePlan_16_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processSpacePlan17(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_17_FAIL' : 'SpacePlan_17_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processSpacePlan18(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_18_FAIL' : 'SpacePlan_18_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processSpacePlan19(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_19_FAIL' : 'SpacePlan_19_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processSpacePlan20(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_20_FAIL' : 'SpacePlan_20_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processSpacePlan21(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_21_FAIL' : 'SpacePlan_21_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processSpacePlan22(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_22_FAIL' : 'SpacePlan_22_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processSpacePlan23(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_23_FAIL' : 'SpacePlan_23_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processSpacePlan24(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_24_FAIL' : 'SpacePlan_24_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processSpacePlan25(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_25_FAIL' : 'SpacePlan_25_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processSpacePlan26(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_26_FAIL' : 'SpacePlan_26_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processSpacePlan27(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_27_FAIL' : 'SpacePlan_27_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processSpacePlan28(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_28_FAIL' : 'SpacePlan_28_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processSpacePlan29(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_29_FAIL' : 'SpacePlan_29_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processSpacePlan30(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_30_FAIL' : 'SpacePlan_30_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processSpacePlan31(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_31_FAIL' : 'SpacePlan_31_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processSpacePlan32(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_32_FAIL' : 'SpacePlan_32_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processSpacePlan33(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_33_FAIL' : 'SpacePlan_33_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processSpacePlan34(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_34_FAIL' : 'SpacePlan_34_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processSpacePlan35(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_35_FAIL' : 'SpacePlan_35_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processSpacePlan36(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_36_FAIL' : 'SpacePlan_36_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processSpacePlan37(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_37_FAIL' : 'SpacePlan_37_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processSpacePlan38(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_38_FAIL' : 'SpacePlan_38_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processSpacePlan39(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_39_FAIL' : 'SpacePlan_39_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processSpacePlan40(input) {
        const issues = [];
        if (!input.organizationId)
            issues.push('organizationId');
        if (!input.actorId)
            issues.push('actorId');
        if (!input.resourceId)
            issues.push('resourceId');
        if (input.quantity !== undefined && input.quantity < 1)
            issues.push('quantity');
        if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start))
            issues.push('range');
        if (input.tags && input.tags.length > 20)
            issues.push('too many tags');
        if (input.metadata && Object.keys(input.metadata).length > 50)
            issues.push('metadata too large');
        if (input.flags?.maintenance && input.action === 'write')
            issues.push('maintenance blocks write');
        if (input.flags?.readonly && input.action !== 'read')
            issues.push('readonly mode');
        if ((input.priority ?? 0) > 10)
            issues.push('priority out of range');
        if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel))
            issues.push('bad channel');
        return {
            ok: issues.length === 0,
            code: issues.length ? 'SpacePlan_40_FAIL' : 'SpacePlan_40_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    runAll(input) {
        return [
            this.processSpacePlan1(input),
            this.processSpacePlan2(input),
            this.processSpacePlan3(input),
            this.processSpacePlan4(input),
            this.processSpacePlan5(input),
            this.processSpacePlan6(input),
            this.processSpacePlan7(input),
            this.processSpacePlan8(input),
            this.processSpacePlan9(input),
            this.processSpacePlan10(input),
            this.processSpacePlan11(input),
            this.processSpacePlan12(input),
            this.processSpacePlan13(input),
            this.processSpacePlan14(input),
            this.processSpacePlan15(input),
            this.processSpacePlan16(input),
            this.processSpacePlan17(input),
            this.processSpacePlan18(input),
            this.processSpacePlan19(input),
            this.processSpacePlan20(input),
            this.processSpacePlan21(input),
            this.processSpacePlan22(input),
            this.processSpacePlan23(input),
            this.processSpacePlan24(input),
            this.processSpacePlan25(input),
            this.processSpacePlan26(input),
            this.processSpacePlan27(input),
            this.processSpacePlan28(input),
            this.processSpacePlan29(input),
            this.processSpacePlan30(input),
            this.processSpacePlan31(input),
            this.processSpacePlan32(input),
            this.processSpacePlan33(input),
            this.processSpacePlan34(input),
            this.processSpacePlan35(input),
            this.processSpacePlan36(input),
            this.processSpacePlan37(input),
            this.processSpacePlan38(input),
            this.processSpacePlan39(input),
            this.processSpacePlan40(input),
        ];
    }
    summarize(results) {
        const passed = results.filter((r) => r.ok).length;
        const failed = results.length - passed;
        const avgScore = results.reduce((a, b) => a + b.score, 0) / (results.length || 1);
        return { passed, failed, avgScore };
    }
}
//# sourceMappingURL=spacePlanningEngine.js.map