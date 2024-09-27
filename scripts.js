function convertToValidJson(jsonString) {
	// Remove trailing comma (if any) and trim whitespace
	const cleanedString = jsonString
		.replace("const mockData = ", "")
		.replace(/,\s*$/, "")
		.replace(/\bid\b(?=\s*:)/g, '"id"')
		.replace(/\bname\b(?=\s*:)/g, '"name"')
		.replace(/\bage\b(?=\s*:)/g, '"age"')
		.replace(/\brole\b(?=\s*:)/g, '"role"')
		.replace(/\bhireDate\b(?=\s*:)/g, '"hireDate"')
		.replace(/\bisActive\b(?=\s*:)/g, '"isActive"')
		.replace(/\bsalary\b(?=\s*:)/g, '"salary"')
		.replace(/\bdepartment\b(?=\s*:)/g, '"department"')
		.replace(/\bprojectsCompleted\b(?=\s*:)/g, '"projectsCompleted"')
		.replace(/\blastLogin\b(?=\s*:)/g, '"lastLogin"')
		.replace(/\baccessLevel\b(?=\s*:)/g, '"accessLevel"')
		.replace(";", "")
		.trim();

	// console.log("Cleaned JSON string:", cleanedString);

	// Parse the cleaned string as JSON
	try {
		const jsonData = JSON.parse(cleanedString);
		// console.log("Valid JSON data:", jsonData);
		return jsonData;
	} catch (error) {
		console.error("Failed to parse JSON:");
	}
}
const mockData = async () => {
	const response = await fetch(
		"https://run.mocky.io/v3/69f60a58-3a36-48c5-a9cf-b100b015950c"
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const textData = await response.text();

	// console.log(textData);

	const jsonData = convertToValidJson(textData);
	// console.log(jsonData);
	return jsonData;
};
const getData = async () => {
	const data = await mockData();
	// console.log(data);
	return data;

	// get data from data.json
	// const data = await fetch("./data.json");
	// const jsonData = await data.json();
	// return jsonData;
};

async function renderTable(data) {
	if (!data) {
		data = await getData();
	}
	const tbody = document.querySelector("#dataTable tbody");
	tbody.innerHTML = ""; // Clear existing rows

	data.forEach((row) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${row.role}</td>
            <td>${new Date(row.hireDate).toLocaleDateString()}</td>
            <td>${row.isActive ? "Yes" : "No"}</td>
        `;
		tbody.appendChild(tr);
	});
}

async function applyFilters() {
	const searchTerm = document.querySelector("#search").value.toLowerCase();
	console.log(searchTerm);
	const data = await getData();
	console.log("applyFilters", data);
	// Apply filters and render table
	const filteredData = data.filter(
		(row) =>
			row.name.toLowerCase().includes(searchTerm) ||
			row.role.toLowerCase().includes(searchTerm) ||
			row.hireDate.includes(searchTerm) ||
			row.id.toString().includes(searchTerm)
	);

	console.log("filteredData", filteredData);

	renderTable(filteredData);
}

// Populate filter options based on selected column
document.querySelector("#column").addEventListener("change", function () {
	const column = this.value;
	const filterOptions = document.querySelector("#filterOptions");
	filterOptions.innerHTML = ""; // Clear existing options

	switch (column) {
		case "id":
			filterOptions.innerHTML = `
                <label for="integerCondition">Condition:</label>
                <select id="integerCondition">
                    <option value="equals">Equals</option>
                    <option value="lessThan">Less than</option>
                    <option value="lessThanOrEqual">Less than or equal</option>
                    <option value="greaterThan">Greater than</option>
                    <option value="greaterThanOrEqual">Greater than or equal</option>
                    <option value="range">Range</option>
                    <option value="notEqual">Not equal</option>
                </select>
                <input type="number" id="integerValue1" placeholder="Value 1">
                <input type="number" id="integerValue2" placeholder="Value 2">
            `;
			break;
		case "name":
			filterOptions.innerHTML = `
                <label for="stringCondition">Condition:</label>
                <select id="stringCondition">
                    <option value="contains">Contains</option>
                    <option value="notContains">Not contains</option>
                    <option value="equals">Equals</option>
                    <option value="notEqual">Not equal</option>
                    <option value="startsWith">Starts with</option>
                    <option value="endsWith">Ends with</option>
                    <option value="isNull">Is null</option>
                    <option value="isNotNull">Is not null</option>
                </select>
                <input type="text" id="stringValue" placeholder="Value">
            `;
			break;
		case "role":
			filterOptions.innerHTML = `
                <label for="enumCondition">Condition:</label>
                <select id="enumCondition">
                    <option value="in">In</option>
                    <option value="equals">Equals</option>
                    <option value="notEqual">Not equal</option>
                    <option value="notIn">Not in</option>
                    <option value="isNull">Is null</option>
                </select>
                <input type="text" id="enumValue" placeholder="Comma separated values">
            `;
			break;
		case "hireDate":
			filterOptions.innerHTML = `
                <label for="dateCondition">Condition:</label>
                <select id="dateCondition">
                    <option value="dateIs">Date is</option>
                    <option value="dateRange">Date range</option>
                    <option value="equals">Equals</option>
                    <option value="lessThan">Less than</option>
                    <option value="lessThanOrEqual">Less than or equal</option>
                    <option value="greaterThan">Greater than</option>
                    <option value="greaterThanOrEqual">Greater than or equal</option>
                    <option value="notEqual">Not equal</option>
                    <option value="isNull">Is null</option>
                    <option value="isNotNull">Is not null</option>
                </select>
                <input type="date" id="dateValue1" placeholder="Date">
                <input type="date" id="dateValue2" placeholder="To Date" style="display: none;">
            `;
			break;
		case "isActive":
			filterOptions.innerHTML = `
                <label for="booleanCondition">Condition:</label>
                <select id="booleanCondition">
                    <option value="equals">Equals</option>
                    <option value="isNull">Is null</option>
                    <option value="isNotNull">Is not null</option>
                </select>
                <select id="booleanValue" style="display: none;">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            `;
			break;
	}
});

// Apply filters
async function applyFilter() {
	const column = document.querySelector("#column").value;
	const data = await getData();
	let filteredData = data;

	switch (column) {
		case "id":
			const integerCondition =
				document.querySelector("#integerCondition").value;
			const intValue1 = parseInt(
				document.querySelector("#integerValue1").value
			);
			const intValue2 = parseInt(
				document.querySelector("#integerValue2").value
			);

			filteredData = data.filter((row) => {
				switch (integerCondition) {
					case "equals":
						return row.id === intValue1;
					case "lessThan":
						return row.id < intValue1;
					case "lessThanOrEqual":
						return row.id <= intValue1;
					case "greaterThan":
						return row.id > intValue1;
					case "greaterThanOrEqual":
						return row.id >= intValue1;
					case "range":
						return row.id >= intValue1 && row.id <= intValue2;
					case "notEqual":
						return row.id !== intValue1;
					default:
						return true;
				}
			});
			break;

		case "name":
			const stringCondition =
				document.querySelector("#stringCondition").value;
			const stringValue = document
				.querySelector("#stringValue")
				.value.toLowerCase();

			filteredData = data.filter((row) => {
				const name = row.name.toLowerCase();
				switch (stringCondition) {
					case "contains":
						return name.includes(stringValue);
					case "notContains":
						return !name.includes(stringValue);
					case "equals":
						return name === stringValue;
					case "notEqual":
						return name !== stringValue;
					case "startsWith":
						return name.startsWith(stringValue);
					case "endsWith":
						return name.endsWith(stringValue);
					case "isNull":
						return row.name === null;
					case "isNotNull":
						return row.name !== null;
					default:
						return true;
				}
			});
			break;

		case "role":
			const enumCondition =
				document.querySelector("#enumCondition").value;
			const enumValues = document
				.querySelector("#enumValue")
				.value.split(",")
				.map((v) => v.trim());

			filteredData = data.filter((row) => {
				const role = row.role;
				switch (enumCondition) {
					case "in":
						return enumValues.includes(role);
					case "equals":
						return (
							enumValues.length === 1 && role === enumValues[0]
						);
					case "notEqual":
						return (
							enumValues.length === 1 && role !== enumValues[0]
						);
					case "notIn":
						return !enumValues.includes(role);
					case "isNull":
						return role === null;
					default:
						return true;
				}
			});
			break;

		case "hireDate":
			const dateCondition =
				document.querySelector("#dateCondition").value;
			const dateValue1 = new Date(
				document.querySelector("#dateValue1").value
			);
			const dateValue2 = new Date(
				document.querySelector("#dateValue2").value
			);

			filteredData = data.filter((row) => {
				const hireDate = new Date(row.hireDate);
				switch (dateCondition) {
					case "dateIs":
						return (
							hireDate.toDateString() ===
							dateValue1.toDateString()
						);
					case "dateRange":
						return hireDate >= dateValue1 && hireDate <= dateValue2;
					case "equals":
						return (
							hireDate.toDateString() ===
							dateValue1.toDateString()
						);
					case "lessThan":
						return hireDate < dateValue1;
					case "lessThanOrEqual":
						return hireDate <= dateValue1;
					case "greaterThan":
						return hireDate > dateValue1;
					case "greaterThanOrEqual":
						return hireDate >= dateValue1;
					case "notEqual":
						return (
							hireDate.toDateString() !==
							dateValue1.toDateString()
						);
					case "isNull":
						return row.hireDate === null;
					case "isNotNull":
						return row.hireDate !== null;
					default:
						return true;
				}
			});
			break;

		case "isActive":
			const booleanCondition =
				document.querySelector("#booleanCondition").value;
			const booleanValue =
				document.querySelector("#booleanValue").value === "true";

			filteredData = data.filter((row) => {
				switch (booleanCondition) {
					case "equals":
						return row.isActive === booleanValue;
					case "isNull":
						return row.isActive === null;
					case "isNotNull":
						return row.isActive !== null;
					default:
						return true;
				}
			});
			break;
	}

	renderTable(filteredData);
}

// Event listeners
document.querySelector("#search").addEventListener("input", applyFilters);
document.querySelector("#idInc").addEventListener("click", async () => {
	const data = await getData();
	data.sort((a, b) => a.id - b.id);
	renderTable(data);
});
document.querySelector("#idDec").addEventListener("click", async () => {
	const data = await getData();
	data.sort((a, b) => b.id - a.id);
	renderTable(data);
});

renderTable();
