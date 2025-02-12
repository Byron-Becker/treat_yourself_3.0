export interface BodyPart {
  id: string;
  score: number;
}

export const backBodyParts: BodyPart[] = [
  // Head & Neck
  { id: 'cervical_spine', score: 5 },
  { id: 'upper_trapezius_left', score: 4 },
  { id: 'upper_trapezius_right', score: 4 },
  
  // Upper Back
  { id: 'thoracic_spine', score: 4 },
  { id: 'left_scapula', score: 3 },
  { id: 'right_scapula', score: 3 },
  
  // Lower Back
  { id: 'lumbar_spine', score: 1 },
  { id: 'left_ql', score: 2 },
  { id: 'right_ql', score: 2 },
  
  // Hips & Glutes
  { id: 'left_hip_pointer', score: 3 },
  { id: 'right_hip_pointer', score: 3 },
  { id: 'left_glute_max', score: 3 },
  { id: 'right_glute_max', score: 3 },
  { id: 'left_glute_med', score: 2},
  { id: 'right_glute_med', score: 2 },
  { id: 'left_lat_glute', score: 4 },
  { id: 'right_lat_glute', score: 4 },
  { id: 'sacrum', score: 1 },
  
  // Thighs
  { id: 'left_out_up_thigh', score: 5 },
  { id: 'left_out_low_thigh', score: 6 },
  { id: 'left_mid_up_thigh', score: 5},
  { id: 'left_mid_low_thigh', score: 6 },
  { id: 'left_in_up_thigh', score: 5 },
  { id: 'left_in_low_thigh', score: 6 },
  { id: 'right_out_up_thigh', score: 5 },
  { id: 'right_out_low_thigh', score: 6 },
  { id: 'right_mid_up_thigh', score: 5 },
  { id: 'right_mid_low_thigh', score: 6 },
  { id: 'right_in_up_thigh', score: 5 },
  { id: 'right_in_low_thigh', score: 6 },
  
  // Knees
  { id: 'left_out_knee', score: 7 },
  { id: 'left_in_knee', score: 7 },
  { id: 'right_out_knee', score: 7 },
  { id: 'right_in_knee', score: 7 },
  
  // Calves
  { id: 'left_out_up_calf', score: 8 },
  { id: 'left_in_up_calf', score: 8 },
  { id: 'left_out_low_calf', score: 9 },
  { id: 'left_in_low_calf', score: 9 },
  { id: 'right_out_up_calf', score: 8 },
  { id: 'right_in_up_calf', score: 8 },
  { id: 'right_out_low_calf', score: 9 },
  { id: 'right_in_low_calf', score: 9 },
  
  // Feet
  { id: 'left_heel', score: 10 },
  { id: 'right_heel', score: 10 },
]

export const frontBodyParts: BodyPart[] = [
  // Abdomen
  { id: 'right_lower_abd', score: 2 },
  { id: 'left_lower_abd', score: 2 },
  { id: 'right_mid_abd', score: 2 },
  { id: 'left_mid_abd', score: 2},
  
  // Hip & Groin
  { id: 'right_inner_thigh_groin', score: 5 },
  { id: 'right_mid-thigh_groin', score: 4 },
  { id: 'left_inner_thigh_groin', score: 5 },
  { id: 'left_mid_inner_thigh', score: 4 },
  // { id: 'left_mid-thigh_groin', score: 4 },
  { id: 'right_outer_asis', score: 3 },
  { id: 'left_outer_asis', score: 3 },
  { id: 'pelvic-area', score: 10 }, //possible question about involuntary urination
  
  // Thighs
  { id: 'right_L2_inner', score: 5 },
  { id: 'right_L2_mid', score: 4 },
  { id: 'right_L2_outer', score: 3 },
  { id: 'left_L2_inner', score: 5 },
  { id: 'left_L2_mid', score: 4 },
  { id: 'left_L2_outer', score: 3 },
  { id: 'right_L3_inner', score: 4 },
  { id: 'left_L3_inner', score: 4 },
  { id: 'right_L3_outer', score: 3 },
  { id: 'left_L3_outer', score: 3 },
  { id: 'right_L4_thigh', score: 5 },
  { id: 'left_L4_thigh', score: 5 },
  { id: 'right_L5_thigh', score: 5 },
  { id: 'left_L5_thigh', score: 5 },
  
  // Knees
  { id: 'right_knee_inner', score: 6 },
  { id: 'left_knee_inner', score: 6 },
  { id: 'right_knee_mid', score: 6 },
  { id: 'left_knee_mid', score: 6 },
  { id: 'right_knee_outer', score: 6 },
  { id: 'left_knee_outer', score: 6 },
  
  // Calves
  { id: 'right_inner_lower_calf', score: 8 },
  { id: 'left_inner_lower_calf', score: 8 },
  { id: 'right_outer_upper_calf', score: 7 },
  { id: 'left_outer_upper_calf', score: 7 },
  { id: 'right_middle_shin', score: 7 },
  { id: 'left_middle_shin', score: 7 },
  { id: 'right_outer_calf_distal', score: 8 },
  { id: 'left_outer_calf_distal', score: 8 },
  { id: 'right_calf_inner_upper', score: 7 },
  { id: 'left_calf_inner_upper', score: 7 },
  
  // Feet
  { id: 'right_inner_heel', score: 9 },
  { id: 'left_inner_heel', score: 9 },
  { id: 'right_lower_foot', score: 8 },
  { id: 'left_foot_top', score: 8 },
  { id: 'right_outer toe', score: 10 },
  { id: 'left_outer_toe', score: 10 },
]

