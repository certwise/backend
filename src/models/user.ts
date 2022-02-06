import Joi from "joi";
export interface IUser {
	_id?: string;
	uid: string;
	name: string;
	email: string;
	organization: string;
	isVerified: boolean;
	createdAt: Date;
	photoURL?: string;
	updatedAt: Date;
}

export const UserSchema = Joi.object().keys({
	_id: Joi.string().optional(),
	uid: Joi.string().required(),
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	organization: Joi.string().required().allow(""),
	isVerified: Joi.boolean().required(),
	createdAt: Joi.date().required(),
	photoURL: Joi.string().optional(),
	updatedAt: Joi.date().required(),
});

export class User implements IUser {
	_id?: string;
	uid: string;
	name: string;
	email: string;
	organization: string;
	isVerified: boolean;
	createdAt: Date;
	photoURL?: string;
	updatedAt: Date;

	constructor(user: IUser) {
		if (user._id) this._id = user._id;
		this.uid = user.uid;
		this.name = user.name;
		this.email = user.email;
		this.organization = user.organization;
		this.isVerified = user.isVerified;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
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

	static delete(
		uid: string,
		dbDelete: (uid: string) => Promise<void>
	): Promise<void> {
		return new Promise((resolve, reject) => {
			dbDelete(uid)
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	}
}
