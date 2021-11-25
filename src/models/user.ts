import Joi from "joi";
export interface IUser {
	uid: string;
	name: string;
	email: string;
	organization: string;
	isVerified: boolean;
	createdAt: Date;
	photoURL?: string;
	updatedAt: Date;
	numberOfTemplatesCreated: number;
	numberOfCerificatesCreated: number;
}

export const UserSchema = Joi.object().keys({
	uid: Joi.string().required(),
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	organization: Joi.string().required().allow(""),
	isVerified: Joi.boolean().required(),
	createdAt: Joi.date().required(),
	photoURL: Joi.string().optional(),
	updatedAt: Joi.date().required(),
	numberOfTemplatesCreated: Joi.number().required(),
	numberOfCerificatesCreated: Joi.number().required(),
});

export class User implements IUser {
	uid: string;
	name: string;
	email: string;
	organization: string;
	isVerified: boolean;
	createdAt: Date;
	photoURL?: string;
	updatedAt: Date;
	numberOfTemplatesCreated: number;
	numberOfCerificatesCreated: number;

	constructor(user: IUser) {
		this.uid = user.uid;
		this.name = user.name;
		this.email = user.email;
		this.organization = user.organization;
		this.isVerified = user.isVerified;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
		this.numberOfTemplatesCreated = user.numberOfTemplatesCreated;
		this.numberOfCerificatesCreated = user.numberOfCerificatesCreated;
	}

	validate(): { error: boolean; message: string } {
		const { error } = UserSchema.validate(this);
		if (error) {
			return {
				error: true,
				message: error.details[0].message,
			};
		} else {
			return {
				error: false,
				message: "",
			};
		}
	}

	create(dbCreate: (user: IUser) => Promise<IUser>): Promise<IUser> {
		return new Promise((resolve, reject) => {
			console.log("user", this);
			dbCreate({ ...this })
				.then((user) => {
					resolve(user);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	update(dbUpdate: (user: IUser) => Promise<IUser>): Promise<IUser> {
		return new Promise((resolve, reject) => {
			dbUpdate({ ...this })
				.then((user) => {
					resolve(user);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	static get(
		uid: string,
		dbGet: (uid: string) => Promise<IUser>
	): Promise<IUser> {
		return new Promise((resolve, reject) => {
			dbGet(uid)
				.then((user) => {
					resolve(user);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}
}
