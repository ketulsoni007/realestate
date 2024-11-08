import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useWindowWidth from 'hooks/windowWidth';
import { useDispatch, useSelector } from 'react-redux';
import config from 'config/config';
import { Avatar, Divider } from '@mui/material';
import { CustomDivider } from 'components/fields/field';
import { ProfileTab } from 'store/Slices/profileSlice';
import ProfileTabPage from 'components/profile/ProfileTabPage';

const Profile = () => {
    const width = useWindowWidth();
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.ui.darkMode);
    const user = useSelector((state) => state.auth.user);
    const selectedTab = useSelector((state) => state.profile.isProfileTab);

    const handleTabChange = (event, newValue) => {
        dispatch(ProfileTab(newValue));
    };

    // Define light and dark theme colors
    const textColor = isDarkMode ? '#FFF' : '#131313';
    const backgroundColor = isDarkMode ? '#2C2C2C' : '#FFF';
    const tabBackgroundColor = isDarkMode ? 'rgb(37 40 54 / 0.6)' : '#FFF';

    return (
        <div className="pt-20 px-[3%] md:px-[6%]"
            style={{
                background: isDarkMode ? 'transparent' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(245, 235, 225, 0.3))',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', // For better compatibility with Safari
            }}
        >
            <Grid container spacing={0}>
                <Grid item xs={12} md={3}>
                    <Box
                        sx={{
                            backgroundColor: width > 899 ? tabBackgroundColor : 'transparent',
                            borderRadius: '12px 12px 0px 0px',
                            padding: '0px',
                            boxShadow: width > 900 ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                        }}
                    >
                        {width > 899 ? (
                            <>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    flexDirection="column"
                                    gap={1}
                                    mb={2}
                                >
                                    <Avatar
                                        src={`${config?.IMAGE_URL}/user/${user?.profile_picture}`}
                                        sx={{
                                            width: '100px',
                                            height: '100px',
                                            mt: 2,
                                            border: '2px solid #FF6400',
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        color={textColor}
                                        fontWeight="bold"
                                        textAlign="center"
                                    >
                                        {user?.first_name + " " + user?.last_name}
                                    </Typography>
                                </Box>
                                <CustomDivider stylings={{ marginBottom: '16px' }} />
                            </>
                        ) : null}

                        <Tabs
                            orientation={width < 900 ? 'horizontal' : 'vertical'}
                            variant="scrollable"
                            value={selectedTab}
                            scrollButtons={'auto'}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': {
                                    color: textColor,
                                    minHeight: '48px',
                                },
                                '& .Mui-selected': {
                                    color: '#FF6400 !important',
                                    fontWeight: 'bold',
                                    borderRadius: `${width < 900 ? '0px' : '8px'}`,
                                },
                                '.MuiTabs-indicator': {
                                    backgroundColor: `${width < 900 ? 'transparent' : '#FF6400'}`,
                                },
                                minHeight: `${width < 900 ? 'auto' : 'calc(100vh - 272px)'}`,
                            }}
                        >
                            <Tab label="Profile Details" />
                            <Tab label="Account Settings" />
                            <Tab label="Privacy" />
                            <Tab label="Notifications" />
                        </Tabs>
                    </Box>
                </Grid>

                {/* Right Side - Content */}
                <Grid item xs={12} md={9}>
                    <Box
                        sx={{
                            padding: '0 2rem',
                            minHeight: 'calc(100vh - 83px)',
                        }}
                    >
                        {selectedTab === 0 && (
                            <ProfileTabPage/>
                        )}
                        {selectedTab === 1 && (
                            <Typography variant="h5" fontWeight="bold">
                                Account Settings
                            </Typography>
                        )}
                        {selectedTab === 2 && (
                            <Typography variant="h5" fontWeight="bold">
                                Privacy
                            </Typography>
                        )}
                        {selectedTab === 3 && (
                            <Typography variant="h5" fontWeight="bold">
                                Notifications
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default Profile;
