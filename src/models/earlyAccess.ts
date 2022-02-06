export interface IEarlyAccess {
	_id?: string;
	inviteCode: string;
	email: string;
}

export class EarlyAccess implements IEarlyAccess {
	_id?: string;
	inviteCode: string;
	email: string;

	constructor(data: IEarlyAccess) {
		this._id = data._id;
		this.inviteCode = data.inviteCode;
		this.email = data.email;
	}

	create(
		dbCreate: (email: string) => Promise<boolean>,
		email: string
	): Promise<boolean> {
		return new Promise((resolve, reject) => {
			dbCreate(email)
				.then((data) => {
					resolve(data);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static checkAccess(
		dbValidateEarlyAccessInviteCode: (
			inviteCode: string,
			email: string
		) => Promise<boolean>,
		inviteCode: string,
		email: string
	): Promise<boolean> {
		console.log("In checkAccess method");
		return new Promise((resolve, reject) => {
			dbValidateEarlyAccessInviteCode(inviteCode, email)
				.then((isValid) => {
					console.log("In checkAccess method2", email, inviteCode);
					if (isValid) resolve(true);
					else reject(false);
				})
				.catch((err) => {
					throw new Error(err);
				});
		});
	}
}
