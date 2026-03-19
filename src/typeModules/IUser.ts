import {Role} from "@/typeModules/useModules";

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    profession: string;
    username: string;
    password: string;
    avatarUrl: string;
    phone: string | null;
    bio: string;
    isActive: boolean;
    uploadId: string;
    roles: Role[];
}
// id: number;
// firstName: string;
// lastName: string;
// middleName: string;
// birthDate: string;
// username: string;
// password: string;
// roles: any;
// userId: number;
// job: IJob;
// userStatus: string;
// createdAt: string;
// updatedAt: string;
// token: string;