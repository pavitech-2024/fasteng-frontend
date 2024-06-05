import ApiBaseURL from '../ApiBaseURL.js';

const superPaveApi = {
	createDosage: (newProject) => ApiBaseURL.post("/superpaveDosage/", newProject),
	deleteDosage: (dosageId) =>ApiBaseURL.delete(`/superpaveDosage/?projectId=${dosageId}`),
	deleteAll :(materialId) =>ApiBaseURL.delete(`/superpaveDosage/?amterialId=${materialId}`),
	getMaterialsDosage: () => ApiBaseURL.get("/material/search?typeExperiment=Dosage"),
	getMaterialsSelectedDosage: (id) => ApiBaseURL.get(`/superpaveDosage/materials?_id=${id}`),
	sendMaterialsDosage: (data) => ApiBaseURL.post("/superpaveDosage/materials", data),
	getPercentPassant: (id) => ApiBaseURL.get(`/superpaveDosage/granulometrys?_id=${id}`),
	sendPercentsComposition: (data) => ApiBaseURL.post("/superpaveDosage/granulometrys", data),
	getSpecificGravities: (id) => ApiBaseURL.get(`/superpaveDosage/specificGravities?_id=${id}`),
	sendSpecificGravities: (data) => ApiBaseURL.post("/superpaveDosage/specificGravities", data),
	sendVolumetricParameters: (data) => ApiBaseURL.post("/superpaveDosage/volumetricParameters", data),
	calculateGmm: (data) => ApiBaseURL.post("/superpaveDosage/calculateGmm", data),
	getExpectedPorcentageAggregate: (id) => ApiBaseURL.get(`/superpaveDosage/expectedPorcentageAggregate?_id=${id}`),
	setChoosenGranulometryComposition: (data) => ApiBaseURL.post("/superpaveDosage/expectedPorcentageAggregate", data),
	sendVolumetricParametersOfChoosenGranulometryComposition: (data) => ApiBaseURL.post("/superpaveDosage/volumetricParametersOfChoosenGranulometryComposition", data),
	getVolumetricParameters: (id) => ApiBaseURL.get(`/superpaveDosage/volumetricParameters?_id=${id}`),
	getVolumetricParametersOfChoosenGranulometryComposition: (id) => ApiBaseURL.get(`/superpaveDosage/volumetricParametersOfChoosenGranulometryComposition?_id=${id}`),
	getGraphsVolumetricParameters: (id) => ApiBaseURL.get(`/superpaveDosage/graphs?_id=${id}`),
	sendVolumetricParametersOfConfirmGranulometryComposition: (data) => ApiBaseURL.post("/superpaveDosage/volumetricParametersOfConfirmGranulometryComposition", data),
	showDataByStep: (data) => ApiBaseURL.get(`/superpaveDosage/showDataByStep?_id=${data.id}&step=${data.step}`),
	searchNotEnded: () => ApiBaseURL.get(`/superpaveDosage/searchNotEnded`),
	sendOverwritePli: (data) => ApiBaseURL.post("/superpaveDosage/overwritePli", data),
	getPliValues: (id) => ApiBaseURL.get(`/superpaveDosage/getPli?_id=${id}`),
	setPhoto: (photo64) => ApiBaseURL.put('/users/photo', photo64),
}

export default superPaveApi;
