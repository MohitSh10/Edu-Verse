import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseSectionData: [],
  courseEntireData: null,
  completedLectures: [],
  totalNoOfLectures: 0,
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => { state.courseSectionData = action.payload; },
    setCourseEntireData: (state, action) => { state.courseEntireData = action.payload; },
    setCompletedLectures: (state, action) => { state.completedLectures = action.payload; },
    setTotalNoOfLectures: (state, action) => { state.totalNoOfLectures = action.payload; },
    updateCompletedLectures: (state, action) => {
      if (!state.completedLectures.includes(action.payload)) {
        state.completedLectures.push(action.payload);
      }
    },
  },
});

export const {
  setCourseSectionData, setCourseEntireData,
  setCompletedLectures, setTotalNoOfLectures, updateCompletedLectures,
} = viewCourseSlice.actions;
export default viewCourseSlice.reducer;
