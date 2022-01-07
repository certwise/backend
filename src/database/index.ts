import monk from "monk";
import dotenv from "dotenv";
dotenv.config();
const db = monk(process.env.MONGO_URI as string);
export default db;

const certificateCollection = db.get("certificates");
const templateCollection = db.get("templates");
const recipientCollection = db.get("recipients");
const groupCollection = db.get("groups");

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
			console.log(result);
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
