// src/app/user/permissions/PermissionTimeline.tsx
'use client';

import React from 'react';
import { Box, Avatar, Typography, Chip, IconButton, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';

export interface Permission {
    id: number;
    zoneType: string;
    schedule: string;
    status: 'granted' | 'denied';
}

interface Props {
    permission: Permission;
    onDetails: (permission: Permission) => void;
}

const Card = styled(Paper)<{ status: 'granted' | 'denied' }>(
    ({ theme, status }) => ({
        borderRadius: theme.spacing(2),
        padding: theme.spacing(3),
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'visible',
        '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor:
                status === 'granted'
                    ? theme.palette.success.main
                    : theme.palette.error.main,
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
        },
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
    })
);

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        // eslint-disable-next-line no-bitwise
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

export const PermissionTimeline: React.FC<Props> = ({
                                                        permission,
                                                        onDetails,
                                                    }) => {
    const { t } = useTranslation('permissions');

    return (
        <Box display="flex" width="100%" position="relative">
            {/* левая линия + точка */}
            <Box
                sx={{
                    width: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor:
                            permission.status === 'granted'
                                ? 'success.main'
                                : 'error.main',
                        mt: 1,
                    }}
                />
                <Box
                    sx={{
                        flex: 1,
                        width: 2,
                        backgroundColor: 'grey.300',
                        mt: 1,
                    }}
                />
            </Box>

            {/* сама карточка */}
            <Card status={permission.status}>
                <Box display="flex" alignItems="center">
                    <Avatar
                        sx={{
                            bgcolor: stringToColor(permission.zoneType),
                            width: 48,
                            height: 48,
                            mr: 2,
                        }}
                    >
                        {permission.zoneType.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">
                            {permission.zoneType}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            color="text.secondary"
                            mt={0.75}
                        >
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.75 }} />
                            <Typography variant="body2" noWrap>
                                {permission.schedule}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center">
                    <Chip
                        label={t(`card.status.${permission.status}`)}
                        color={permission.status === 'granted' ? 'success' : 'error'}
                        size="small"
                        sx={{ mr: 1, minWidth: 64 }}
                    />
                    <IconButton
                        size="small"
                        onClick={() => onDetails(permission)}
                        title={t('card.details')}
                    >
                        <InfoIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Card>
        </Box>
    );
};
