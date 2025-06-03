// src/app/user/permissions/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Divider,
    Skeleton,
    useTheme,
    useMediaQuery,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView, TreeItem } from '@mui/lab';
import { useTranslation } from 'react-i18next';

import { PermissionTimeline, Permission } from './PermissionTimeline';
import { PermissionDetailDialog } from './PermissionDetailDialog';
import api from '@/services/api';

interface RawRule {
    id: number;
    zoneType: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    hasAccess: boolean;
}

export default function PermissionsPage() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useTranslation('permissions');

    const [all, setAll] = useState<Permission[]>([]);
    const [filtered, setFiltered] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string[]>([]);
    const [checkedZones, setCheckedZones] = useState<Set<string>>(new Set());

    const [detailOpen, setDetailOpen] = useState(false);
    const [current, setCurrent] = useState<Permission | null>(null);

    // ─── Fetch данных ───
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await api.get<RawRule[]>('/accessrule/my');
                const mapped: Permission[] = data.map(r => {
                    const parts: string[] = [];
                    if (r.startDate && r.endDate) {
                        parts.push(
                            `${new Date(r.startDate).toLocaleDateString()} – ${new Date(
                                r.endDate
                            ).toLocaleDateString()}`
                        );
                    }
                    if (r.startTime && r.endTime) {
                        parts.push(
                            `${r.startTime.slice(0, 5)} – ${r.endTime.slice(0, 5)}`
                        );
                    }
                    return {
                        id: r.id,
                        zoneType: r.zoneType,
                        schedule: parts.join(' | ') || '—',
                        status: r.hasAccess ? 'granted' : 'denied',
                    };
                });
                setAll(mapped);
                setFiltered(mapped);
                const uniq = Array.from(new Set(mapped.map(p => p.zoneType)));
                setCheckedZones(new Set(uniq));
                setExpanded(uniq.map(z => `zone::${z}`));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ─── Список зон ───
    const zones = useMemo(
        () => Array.from(new Set(all.map(p => p.zoneType))),
        [all]
    );

    // ─── Фильтрация ───
    useEffect(() => {
        const term = search.trim().toLowerCase();
        setFiltered(
            all.filter(
                p =>
                    checkedZones.has(p.zoneType) &&
                    p.zoneType.toLowerCase().includes(term)
            )
        );
    }, [all, checkedZones, search]);

    // ─── Длительности ───
    const durations = useMemo(() => {
        return zones.map(zone => {
            const p = all.find(x => x.zoneType === zone);
            let hours = 0;
            if (p) {
                const last = p.schedule.split(' | ').pop()!;
                const [start, end] = last.split(' – ');
                const [sh, sm] = start.split(':').map(Number);
                const [eh, em] = end.split(':').map(Number);
                hours = eh + em / 60 - (sh + sm / 60);
            }
            return { zone, hours };
        });
    }, [zones, all]);
    const maxHours = useMemo(
        () => Math.max(...durations.map(d => d.hours), 1),
        [durations]
    );

    // ─── Обработчики сайдбара ───
    const toggleZone = (z: string) =>
        setCheckedZones(prev => {
            const next = new Set(prev);
            next.has(z) ? next.delete(z) : next.add(z);
            return next;
        });
    const toggleAll = () =>
        setCheckedZones(prev =>
            prev.size === zones.length ? new Set() : new Set(zones)
        );
    const expandAll = () => setExpanded(['all', ...zones.map(z => `zone::${z}`)]);
    const collapseAll = () => setExpanded([]);

    // ─── Skeleton во время загрузки ───
    if (loading) {
        return (
            <Box p={isSm ? 2 : 4}>
                <Skeleton
                    variant="rectangular"
                    height={isSm ? 200 : 400}
                    sx={{ borderRadius: 2 }}
                />
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection={isSm ? 'column' : 'row'}
            height="100%"
            p={4}
            gap={2}
        >
            {/* ─── Сайдбар: Zones ─── */}
            <Box
                flexShrink={0}
                sx={{
                    width: isSm ? '100%' : 280,
                    borderRight: isSm ? 'none' : `1px solid ${theme.palette.divider}`,
                    pr: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    {t('sidebar.title')}
                </Typography>

                <Box display="flex" alignItems="center" mb={2} gap={1}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder={t('sidebar.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <IconButton size="small" onClick={expandAll}>
                        <ExpandMoreIcon />
                    </IconButton>
                    <IconButton size="small" onClick={collapseAll}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={checkedZones.size === zones.length}
                            indeterminate={
                                checkedZones.size > 0 && checkedZones.size < zones.length
                            }
                            onChange={toggleAll}
                        />
                    }
                    label={t('sidebar.allZones')}
                    sx={{ mb: 1 }}
                />

                <Divider sx={{ mb: 1 }} />

                <TreeView expanded={expanded}>
                    {zones.map(z => (
                        <TreeItem
                            key={z}
                            nodeId={`zone::${z}`}
                            label={
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={checkedZones.has(z)}
                                            onChange={() => toggleZone(z)}
                                        />
                                    }
                                    label={`${z} (${all.filter(p => p.zoneType === z).length})`}
                                />
                            }
                        />
                    ))}
                </TreeView>
            </Box>

            {/* ─── Центральный блок: My Permissions ─── */}
            <Box flex={2} sx={{ overflowY: 'auto', width: '100%' }}>
                <Typography variant="h5" mb={3}>
                    {t('page.title')}
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    {filtered.map(p => (
                        <PermissionTimeline
                            key={p.id}
                            permission={p}
                            onDetails={perm => {
                                setCurrent(perm);
                                setDetailOpen(true);
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* ─── Правый блок: Access Duration ─── */}
            <Box
                flexShrink={0}
                sx={{
                    width: isSm ? '100%' : 250,
                    borderLeft: isSm ? 'none' : `1px solid ${theme.palette.divider}`,
                    pl: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    {t('duration.title')}
                </Typography>
                {durations.map(({ zone, hours }) => {
                    const pct = Math.round((hours / maxHours) * 100);
                    return (
                        <Box key={zone} mb={2}>
                            <Typography variant="body2" gutterBottom>
                                {zone}
                            </Typography>
                            <Box
                                sx={{
                                    bgcolor: 'grey.300',
                                    borderRadius: 1,
                                    height: 10,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: 'primary.main',
                                        width: `${pct}%`,
                                        height: '100%',
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {hours.toFixed(1)}h
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* ─── Диалог деталей ─── */}
            <PermissionDetailDialog
                open={detailOpen}
                permission={current}
                onClose={() => setDetailOpen(false)}
            />
        </Box>
    );
}
