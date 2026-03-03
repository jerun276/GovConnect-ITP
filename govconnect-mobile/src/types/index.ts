export type User = {
  id: string;
  email: string;
  nic: string;
  username: string;
  userType: 'citizen' | 'authority' | 'developer_admin';
};

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  nic?: string;
  username: string;
  phoneNumber?: string;
  address?: string;
};

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'ACTION_TAKEN'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED';

export type TargetType = 'DEPARTMENT' | 'STATUTORY_BOARD' | 'DISTRICT' | 'OFFICIAL';

export type CreateComplaintRequest = {
  categoryCode: string;
  descriptionText: string;
  targetType: TargetType;
  selectedDepartmentId?: string;
  selectedStatutoryBoardId?: string;
  incidentProvinceId?: string;
  incidentDistrictId?: string;
  incidentDsDivisionId?: string;
  incidentGnDivisionId?: string;
};

export type ComplaintDto = {
  id: string;
  complaintCode: string;
  submittedByUserId: string;
  categoryCode: string;
  descriptionText: string;
  targetType: TargetType;
  selectedDepartmentId: string | null;
  selectedStatutoryBoardId: string | null;
  incidentProvinceId: string;
  incidentDistrictId: string;
  incidentDsDivisionId: string;
  incidentGnDivisionId: string | null;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
};

export type Province = {
  id: string;
  name: string;
};

export type District = {
  id: string;
  provinceId: string;
  name: string;
};

export type DsDivision = {
  id: string;
  districtId: string;
  name: string;
};

export type GnDivision = {
  id: string;
  dsDivisionId: string;
  name: string;
  gnCode: string;
};

export type Department = {
  id: string;
  code: string;
  name: string;
  ministry?: string;
};

export type StatutoryBoard = {
  id: string;
  code: string;
  name: string;
  boardType: string;
};
