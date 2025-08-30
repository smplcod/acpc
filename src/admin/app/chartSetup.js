import { Chart as ChartJS, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
ChartJS.register(...registerables, zoomPlugin)
export { ChartJS }
