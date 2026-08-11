/* Boot and the day loop: office -> bench -> report -> office. */

import { $, bindStage } from "./util.js";
import { load, G } from "./state.js";
import { register, bindRoot, go } from "./scenes.js";
import { office } from "./office.js";
import { bench } from "./bench.js";
import { report } from "./report.js";

register("office", office);
register("bench", bench);
register("report", report);

bindStage($("#stage"));
bindRoot($("#scene"));
load();

function toOffice(){
  go("office", { onStart: jobs => toBench(jobs) });
}
function toBench(jobs){
  go("bench", { jobs, day: G.day, onDone: result => toReport(result) });
}
function toReport(result){
  go("report", { result, onNext: () => toOffice() });
}

toOffice();
