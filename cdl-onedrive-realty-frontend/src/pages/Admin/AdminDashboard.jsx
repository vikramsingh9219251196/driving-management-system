import React, { useState, useEffect } from "react";
import drivingCourseService from "../../services/drivingCourse.service";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Skeleton,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalVideos: 0,
    courses: [],
  });
  const navigate=useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsResponse = await drivingCourseService.getAdminStats();
      const coursesResponse = await drivingCourseService.getAllCourses();
      const courses = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : coursesResponse.data.courses || [];

      setStats({
        totalUsers: statsResponse.data.stats.allUsersCount,
        totalCourses: courses.length,
        totalVideos: courses.reduce(
          (total, course) => total + (course.numberOfLessons || 0),
          0
        ),
        courses: courses,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };
  const newcourseadded=()=>{
    navigate("/admin/courses/create");
  }

  const handleDelete = async (courseId) => {
    // Verify the course exists in your current state before attempting to delete
    const courseExists = stats.courses.some(course => course._id === courseId);
    
    if (!courseExists) {
        toast.error("Course not found in current list");
        return;
    }

    if (window.confirm("Are you sure you want to delete this course?")) {
        try {
            const response = await drivingCourseService.deleteCourse(courseId);
            
            if (response.data.success) {
                toast.success("Course deleted successfully");
                fetchStats(); // Refresh the data
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            toast.error(error.response?.data?.message || "Failed to delete course");
        }
    }
};


const handleEdit = async (courseId) => {
  try {
      console.log('Navigating to edit page for course:', courseId);
      
      // Optional: Verify course exists before navigation
      const courseExists = stats.courses.some(course => course._id === courseId);
      
      if (!courseExists) {
          toast.error("Course not found");
          return;
      }
      
      // Navigate to edit page
      navigate(`/courses/edit/${courseId}`);
  } catch (error) {
      console.error("Error navigating to edit page:", error);
      toast.error("Failed to navigate to edit page");
  }
};

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  const getPieChartData = () => [
    { name: "Users", value: stats.totalUsers },
    { name: "Courses", value: stats.totalCourses },
    { name: "Videos", value: stats.totalVideos },
  ];
  const getBarChartData = () =>
    stats.courses.map((course) => ({
      name: course.courseName || "Untitled Course",
      lessons: course.numberOfLessons || 0,
    }));
  if (loading) {
    return (
      <Layout>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid key={item} item xs={12} sm={4}>
                <Skeleton variant="rectangular" width="100%" height={150} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
    );
  }
  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 60, opacity: 0.6 }} />,
      gradient: "linear-gradient(145deg, #2196F3 30%, #21CBF3 90%)",
      info: "Total number of registered users in the system",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: <SchoolIcon sx={{ fontSize: 60, opacity: 0.6 }} />,
      gradient: "linear-gradient(145deg, #4CAF50 30%, #81C784 90%)",
      info: "Total number of available courses",
    },
    {
      title: "Total Videos",
      value: stats.totalVideos,
      icon: <OndemandVideoIcon sx={{ fontSize: 60, opacity: 0.6 }} />,
      gradient: "linear-gradient(145deg, #FF9800 30%, #FFB74D 90%)",
      info: "Total number of video lessons across all courses",
    },
  ];
  return (
    <Layout>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
        }}
        className="bg-white dark:bg-gray-900 transition-colors duration-200"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
              className="text-[#1a237e] dark:text-white"
            >
              Admin Dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={
                refreshing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <RefreshIcon />
                )
              }
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #2196F3 90%)",
                },
              }}
            >
              {refreshing ? "..." : "Refresh Data"}
            </Button>
          </Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      background: stat.gradient,
                      color: "white",
                      borderRadius: 3,
                      boxShadow: "0 8px 20px rgba(33, 150, 243, 0.3)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                    className="dark:bg-gray-800 transition-colors duration-200"
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", opacity: 0.8 }}
                          >
                            {stat.title}
                            <Tooltip title={stat.info} placement="top">
                              <InfoIcon
                                sx={{
                                  ml: 1,
                                  fontSize: 16,
                                  opacity: 0.7,
                                  cursor: "help",
                                }}
                              />
                            </Tooltip>
                          </Typography>
                          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                            {stat.value}
                          </Typography>
                        </Box>
                        {stat.icon}
                      </Box>
                    </CardContent>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                        animation: "shine 2s infinite",
                        "@keyframes shine": {
                          "0%": { transform: "translateX(-100%)" },
                          "100%": { transform: "translateX(100%)" },
                        },
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    // Use theme-aware background
                    bgcolor: "background.paper", // This will automatically switch in dark mode
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="dark:bg-gray-800"
                >
                  <Typography
                    variant="h6"
                    className="text-gray-800 dark:text-gray-100"
                    sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                  >
                    Distribution Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPieChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                    bgcolor: "background.paper",
                    backdropFilter: "blur(10px)",
                  }}
                  className="dark:bg-gray-800 transition-colors duration-200"
                >
                  <Typography
                    variant="h6"
                    className="text-gray-800 dark:text-gray-100"
                    sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                  >
                    Lessons per Course
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getBarChartData()}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="lessons" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
          <motion.div variants={itemVariants}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                bgcolor: "background.paper",
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
              }}
              className="dark:bg-gray-800 transition-colors duration-200"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                    }}
                    className="text-[#1a237e] dark:text-gray-100"
                  >
                    Course Management
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-[#1a237e] dark:text-gray-100"
                  >
                    Manage your courses and their content
                  </Typography>
                </Box>
                <Button
                onClick={() => newcourseadded()}
                  variant="contained"
                  startIcon={<SchoolIcon />}
                  sx={{
                    background:
                      "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                    boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #388E3C 30%, #4CAF50 90%)",
                    },
                  }}
                >
                  Add New Course
                </Button>
              </Box>

              <TableContainer
                sx={{
                  "& .MuiTable-root": {
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                  },
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderBottom: "none",
                        }}
                        className="text-[#1a237e] dark:text-gray-100"
                      >
                        Course Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",

                          fontSize: "1rem",
                          borderBottom: "none",
                        }}
                        className="text-[#1a237e] dark:text-gray-100"
                      >
                        Total Lessons
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderBottom: "none",
                        }}
                        className="text-[#1a237e] dark:text-gray-100"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderBottom: "none",
                        }}
                        className="text-[#1a237e] dark:text-gray-100"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.courses.map((course) => (
                      <TableRow
                        key={course._id}
                        sx={{
                          bgcolor: "background.paper",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          borderRadius: 2,
                          "& > td": {
                            borderTop: "1px solid rgba(224, 224, 224, 0.4)",
                            borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
                            "&:first-of-type": {
                              borderLeft: "1px solid rgba(224, 224, 224, 0.4)",
                              borderTopLeftRadius: 8,
                              borderBottomLeftRadius: 8,
                            },
                            "&:last-child": {
                              borderRight: "1px solid rgba(224, 224, 224, 0.4)",
                              borderTopRightRadius: 8,
                              borderBottomRightRadius: 8,
                            },
                          },
                          "&:hover": {
                            backgroundColor: "#f8f9ff",
                            transform: "translateY(-2px)",
                            transition: "all 0.3s ease",
                          },
                        }}
                        className="dark:bg-gray-700 hover:dark:bg-gray-600 transition-colors duration-200"
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <SchoolIcon
                              sx={{ mr: 2 }}
                              className="text-[#1a237e] dark:text-gray-100"
                            />
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}
                                className="text-[#1a237e] dark:text-gray-100"
                              >
                                {course.courseName || "Untitled Course"}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="text-[#1a237e] dark:text-gray-100"
                              >
                                Created on {new Date().toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${course.numberOfLessons || 0} Lessons`}
                            sx={{
                              backgroundColor: alpha("#1a237e", 0.1),
                              fontWeight: "bold",
                            }}
                            className="bg-opacity-10 dark:bg-opacity-20 text-[#1a237e] dark:text-gray-100"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Active"
                            sx={{
                              backgroundColor: alpha("#4CAF50", 0.1),
                              color: "#4CAF50",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Course">
                            <Button
                              variant="contained" // Changed from outlined to contained
                              startIcon={<EditIcon />}
                              onClick={() => handleEdit(course._id)}
                              sx={{
                                mr: 1,
                                backgroundColor: "#1976D2", // Solid blue background
                                color: "white", // White text
                                "&:hover": {
                                  backgroundColor: "#1565C0", // Darker blue on hover
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "white",
                                },
                              }}
                            >
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete Course">
                            <Button
                              variant="contained" // Changed from outlined to contained
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDelete(course._id)}
                              sx={{
                                backgroundColor: "#d32f2f", // Solid red background
                                color: "white", // White text
                                "&:hover": {
                                  backgroundColor: "#c62828", // Darker red on hover
                                },
                                "& .MuiSvgIcon-root": {
                                  // Style for the icon
                                  color: "white",
                                },
                              }}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        </motion.div>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
