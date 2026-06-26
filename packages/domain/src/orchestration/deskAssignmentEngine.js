export class DeskAssignmentEngine {
    processDeskAssign1(input) {
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
            code: issues.length ? 'DeskAssign_1_FAIL' : 'DeskAssign_1_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processDeskAssign2(input) {
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
            code: issues.length ? 'DeskAssign_2_FAIL' : 'DeskAssign_2_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processDeskAssign3(input) {
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
            code: issues.length ? 'DeskAssign_3_FAIL' : 'DeskAssign_3_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processDeskAssign4(input) {
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
            code: issues.length ? 'DeskAssign_4_FAIL' : 'DeskAssign_4_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processDeskAssign5(input) {
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
            code: issues.length ? 'DeskAssign_5_FAIL' : 'DeskAssign_5_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processDeskAssign6(input) {
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
            code: issues.length ? 'DeskAssign_6_FAIL' : 'DeskAssign_6_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processDeskAssign7(input) {
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
            code: issues.length ? 'DeskAssign_7_FAIL' : 'DeskAssign_7_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processDeskAssign8(input) {
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
            code: issues.length ? 'DeskAssign_8_FAIL' : 'DeskAssign_8_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processDeskAssign9(input) {
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
            code: issues.length ? 'DeskAssign_9_FAIL' : 'DeskAssign_9_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processDeskAssign10(input) {
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
            code: issues.length ? 'DeskAssign_10_FAIL' : 'DeskAssign_10_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processDeskAssign11(input) {
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
            code: issues.length ? 'DeskAssign_11_FAIL' : 'DeskAssign_11_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processDeskAssign12(input) {
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
            code: issues.length ? 'DeskAssign_12_FAIL' : 'DeskAssign_12_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processDeskAssign13(input) {
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
            code: issues.length ? 'DeskAssign_13_FAIL' : 'DeskAssign_13_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processDeskAssign14(input) {
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
            code: issues.length ? 'DeskAssign_14_FAIL' : 'DeskAssign_14_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processDeskAssign15(input) {
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
            code: issues.length ? 'DeskAssign_15_FAIL' : 'DeskAssign_15_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processDeskAssign16(input) {
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
            code: issues.length ? 'DeskAssign_16_FAIL' : 'DeskAssign_16_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processDeskAssign17(input) {
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
            code: issues.length ? 'DeskAssign_17_FAIL' : 'DeskAssign_17_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processDeskAssign18(input) {
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
            code: issues.length ? 'DeskAssign_18_FAIL' : 'DeskAssign_18_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processDeskAssign19(input) {
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
            code: issues.length ? 'DeskAssign_19_FAIL' : 'DeskAssign_19_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processDeskAssign20(input) {
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
            code: issues.length ? 'DeskAssign_20_FAIL' : 'DeskAssign_20_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processDeskAssign21(input) {
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
            code: issues.length ? 'DeskAssign_21_FAIL' : 'DeskAssign_21_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processDeskAssign22(input) {
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
            code: issues.length ? 'DeskAssign_22_FAIL' : 'DeskAssign_22_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processDeskAssign23(input) {
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
            code: issues.length ? 'DeskAssign_23_FAIL' : 'DeskAssign_23_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processDeskAssign24(input) {
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
            code: issues.length ? 'DeskAssign_24_FAIL' : 'DeskAssign_24_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processDeskAssign25(input) {
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
            code: issues.length ? 'DeskAssign_25_FAIL' : 'DeskAssign_25_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processDeskAssign26(input) {
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
            code: issues.length ? 'DeskAssign_26_FAIL' : 'DeskAssign_26_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processDeskAssign27(input) {
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
            code: issues.length ? 'DeskAssign_27_FAIL' : 'DeskAssign_27_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processDeskAssign28(input) {
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
            code: issues.length ? 'DeskAssign_28_FAIL' : 'DeskAssign_28_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processDeskAssign29(input) {
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
            code: issues.length ? 'DeskAssign_29_FAIL' : 'DeskAssign_29_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processDeskAssign30(input) {
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
            code: issues.length ? 'DeskAssign_30_FAIL' : 'DeskAssign_30_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processDeskAssign31(input) {
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
            code: issues.length ? 'DeskAssign_31_FAIL' : 'DeskAssign_31_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processDeskAssign32(input) {
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
            code: issues.length ? 'DeskAssign_32_FAIL' : 'DeskAssign_32_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processDeskAssign33(input) {
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
            code: issues.length ? 'DeskAssign_33_FAIL' : 'DeskAssign_33_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    processDeskAssign34(input) {
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
            code: issues.length ? 'DeskAssign_34_FAIL' : 'DeskAssign_34_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 6),
        };
    }
    processDeskAssign35(input) {
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
            code: issues.length ? 'DeskAssign_35_FAIL' : 'DeskAssign_35_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 0),
        };
    }
    processDeskAssign36(input) {
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
            code: issues.length ? 'DeskAssign_36_FAIL' : 'DeskAssign_36_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 1),
        };
    }
    processDeskAssign37(input) {
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
            code: issues.length ? 'DeskAssign_37_FAIL' : 'DeskAssign_37_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 2),
        };
    }
    processDeskAssign38(input) {
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
            code: issues.length ? 'DeskAssign_38_FAIL' : 'DeskAssign_38_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 3),
        };
    }
    processDeskAssign39(input) {
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
            code: issues.length ? 'DeskAssign_39_FAIL' : 'DeskAssign_39_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 4),
        };
    }
    processDeskAssign40(input) {
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
            code: issues.length ? 'DeskAssign_40_FAIL' : 'DeskAssign_40_OK',
            issues,
            score: Math.max(0, 100 - issues.length * 10 - 5),
        };
    }
    runAll(input) {
        return [
            this.processDeskAssign1(input),
            this.processDeskAssign2(input),
            this.processDeskAssign3(input),
            this.processDeskAssign4(input),
            this.processDeskAssign5(input),
            this.processDeskAssign6(input),
            this.processDeskAssign7(input),
            this.processDeskAssign8(input),
            this.processDeskAssign9(input),
            this.processDeskAssign10(input),
            this.processDeskAssign11(input),
            this.processDeskAssign12(input),
            this.processDeskAssign13(input),
            this.processDeskAssign14(input),
            this.processDeskAssign15(input),
            this.processDeskAssign16(input),
            this.processDeskAssign17(input),
            this.processDeskAssign18(input),
            this.processDeskAssign19(input),
            this.processDeskAssign20(input),
            this.processDeskAssign21(input),
            this.processDeskAssign22(input),
            this.processDeskAssign23(input),
            this.processDeskAssign24(input),
            this.processDeskAssign25(input),
            this.processDeskAssign26(input),
            this.processDeskAssign27(input),
            this.processDeskAssign28(input),
            this.processDeskAssign29(input),
            this.processDeskAssign30(input),
            this.processDeskAssign31(input),
            this.processDeskAssign32(input),
            this.processDeskAssign33(input),
            this.processDeskAssign34(input),
            this.processDeskAssign35(input),
            this.processDeskAssign36(input),
            this.processDeskAssign37(input),
            this.processDeskAssign38(input),
            this.processDeskAssign39(input),
            this.processDeskAssign40(input),
        ];
    }
    summarize(results) {
        const passed = results.filter((r) => r.ok).length;
        const failed = results.length - passed;
        const avgScore = results.reduce((a, b) => a + b.score, 0) / (results.length || 1);
        return { passed, failed, avgScore };
    }
}
//# sourceMappingURL=deskAssignmentEngine.js.map