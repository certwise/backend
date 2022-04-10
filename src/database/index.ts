import monk from "monk";
import dotenv from "dotenv";
dotenv.config();
const db = monk(process.env.MONGO_URI as string);
export default db;

const earlyAccessCollection = db.get("earlyAccess");

const certificateCollection = db.get("certificates");
const templateCollection = db.get("templates");
const recipientCollection = db.get("recipients");
const groupCollection = db.get("groups");

export const dbCreateEarlyAccessRequest = (email: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		earlyAccessCollection.count({ email: email }).then((count) => {
			if (count > 0) {
				reject(false);
			} else {
				earlyAccessCollection
					.insert({
						email,
						isActive: false,
						inviteCode: `CW_EARLY_${(Math.random() * 1000).toFixed(0)}_${
							email.split("@")[0]
						}`,
					})
					.then(() => {
						resolve(true);
					})
					.catch((err) => {
						reject(err);
					});
			}
		});
	});
};

export const dbValidateEarlyAccessInviteCode = (
	inviteCode: string,
	email: string
): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		earlyAccessCollection
			.findOne({ inviteCode, email })
			.then((data) => {
				console.log("In db findOne method", data);
				if (data) resolve(true);
				else resolve(false);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const dashboardView = (organizationId: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const certificateCount = certificateCollection.count({
			organization: organizationId,
		});
		const issuedCount = certificateCollection.count({
			organization: organizationId,
			isIssued: true,
			isRevoked: false,
		});
		const revokedCount = certificateCollection.count({
			organization: organizationId,
			isRevoked: true,
		});
		const createdCount = certificateCollection.count({
			organization: organizationId,
			isIssued: false,
			isRevoked: false,
		});
		const templateCount = templateCollection.count({
			organization: organizationId,
		});
		const archivedCount = templateCollection.count({
			organization: organizationId,
			isArchived: true,
		});
		const recipientsCount = recipientCollection.count({
			organization: organizationId,
		});
		const recipientsNotInGroup = recipientCollection.count({
			organization: organizationId,
			group: [],
		});
		const groupCount = groupCollection.count({ organization: organizationId });

		Promise.all([
			certificateCount,
			issuedCount,
			revokedCount,
			createdCount,
			templateCount,
			archivedCount,
			recipientsCount,
			recipientsNotInGroup,
			groupCount,
		]).then((result) => {
			resolve({
				certificates: {
					total: result[0],
					issued: result[1],
					revoked: result[2],
					created: result[3],
				},
				templates: {
					total: result[4],
					archived: result[5],
				},
				recipients: {
					total: result[6],
					notInGroup: result[7],
				},
				groups: result[8],
			});
		});
	});
};

export const dbSubmitFeedback = (feedback: any): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		const feedbackCollection = db.get("feedbacks");
		feedbackCollection
			.insert(feedback)
			.then(() => {
				resolve(true);
			})
			.catch((err) => {
				reject(err);
			});
	});
};
