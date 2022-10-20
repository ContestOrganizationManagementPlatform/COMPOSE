<script>
	import { Pie } from "svelte-chartjs";
	export let labels;
	export let dataSet;

	const data = {
		labels: labels,
		datasets: [
			{
				data: dataSet,
				backgroundColor: [
					"#E6F1E1",
					"#497B83",
					"#83B09E",
					"#4F7F62",
					"#254B6D",
					"#64A18A",
					"#1F4B2A",
					"#212E1A",
					"#111C3E",
				],
				hoverBackgroundColor: [
					"#E6F1E1",
					"#497B83",
					"#83B09E",
					"#4F7F62",
					"#254B6D",
					"#64A18A",
					"#1F4B2A",
					"#212E1A",
					"#111C3E",
				],
			},
		],
	};

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
	} from "chart.js";

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

<Pie {data} options={{ responsive: true }} />
