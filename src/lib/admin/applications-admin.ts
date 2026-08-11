import { getDb } from "@/lib/firebase/admin";
import { APPLICATIONS_COLLECTION, ApplicationDoc, ApplicationStatus, toApplication } from "@/lib/applications";

export async function getAllApplicationsForAdmin(): Promise<ApplicationDoc[]> {
  const snap = await getDb().collection(APPLICATIONS_COLLECTION).get();
  return snap.docs.map(toApplication).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  await getDb().collection(APPLICATIONS_COLLECTION).doc(applicationId).update({ status });
}
