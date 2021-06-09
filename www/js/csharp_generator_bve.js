if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
      value: function(search, rawPos) {
          var pos = rawPos > 0 ? rawPos|0 : 0;
          return this.substring(pos, pos + search.length) === search;
      }
  });
}
function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

Blockly.CSharp.bveTimerNameDB = new Blockly.Names();

Blockly.CSharp.addReservedWords([
  "BlocklyAtsPlugin",
  "DoorChange",
  "Elapse",
  "HornBlow",
  "IRuntime",
  "Initialize",
  "KeyDown",
  "KeyUp",
  "Load",
  "OpenBveApi",
  "PerformAI",
  "SetBeacon",
  "SetBrake",
  "SetPower",
  "SetReverser",
  "SetSignal",
  "SetVehicleSpecs",
  "System",
  "Unload",
  "_pbeaconType",
  "_pbeaconSignal",
  "_pbeaconDistance",
  "_pbeaconOptional",
  "_phorntype",
  "_pinitindex",
  "_pkey",
  "_psignal",
  "_c",
  "_p1",
  "_p2",
].join(","));

if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (;;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    // Could we try:
    // return Array(count + 1).join(this);
    return rpt;
  }
}

function indentString(str, count, shorterfirst) {
  if (!count) count = 1;
  var result = str.replace(/^/gm, " ".repeat(count));
  if (shorterfirst) result = result.substring(2);
  return result;
}

function batsExportCSharp(workspace) {
  Blockly.CSharp.init(workspace);

  var allHats = ["bve_hat_elapse", "bve_hat_initialize", "bve_hat_keydown_any", "bve_hat_keyup_any", "bve_hat_horn_blow", 
    "bve_hat_door_change", "bve_hat_set_signal", "bve_hat_set_beacon", "bve_hat_load", "bve_hat_dispose"];
  var code = "  private dynamic _c;\n  private FunctionCompanion _f;\n" + 
    "  public AtsProgram(object c, FunctionCompanion f) { _c = c; _f = f; }\n\n";
  var blocks = workspace.getTopBlocks(false);
  for (var i = 0, block; block = blocks[i]; i++) {
    if (block.type.startsWith("bve_hat")) {
      removeItemOnce(allHats, block.type);
      code += indentString(Blockly.CSharp.blockToCode(block, true).trim(), 4, true);
      //var nextBlock = block.getNextBlock();
      //if (nextBlock) code += Blockly.CSharp.blockToCode(nextBlock);
      code += "\n  }\n\n";
    } else if (block.type == "procedures_defnoreturn" || block.type == "procedures_defreturn") {
      code += indentString(Blockly.CSharp.blockToCode(block), 2);
    }
  }
  code += "\n";
  for (var i = 0, hatName; hatName = allHats[i]; i++) {
    code += "  " + Blockly.CSharp[hatName]().trim() + " }\n";
  }

  code = Blockly.CSharp.finish(code);
  return "public class AtsProgram {\n" + code + "\n}";
}

Blockly.CSharp.bve_hat_elapse=function(block){
  return "public void Elapse() {\n";
}
Blockly.CSharp.bve_hat_initialize=function(block){
  return "public void Initialize(int _pinitindex) {\n";
}
Blockly.CSharp.bve_hat_keydown_any=function(block){
  return "public void KeyDown(int _pkey) {\n";
}
Blockly.CSharp.bve_hat_keyup_any=function(block){
  return "public void KeyUp(int _pkey) {\n";
}
Blockly.CSharp.bve_hat_horn_blow=function(block){
  return "public void HornBlow(int _phorntype) {\n";
}
Blockly.CSharp.bve_hat_door_change=function(block){
  return "public void DoorChange() {\n";
}
Blockly.CSharp.bve_hat_set_signal=function(block){
  return "public void SetSignal(int _psignal) {\n";
}
Blockly.CSharp.bve_hat_set_beacon=function(block){
  return "public void SetBeacon(int _pbeaconType, int _pbeaconOptional, int _pbeaconSignal, double _pbeaconDistance) {\n";
}
Blockly.CSharp.bve_hat_load=function(block){
  return "public void Load() {\n";
}
Blockly.CSharp.bve_hat_dispose=function(block){
  return "public void Unload() {\n";
}
Blockly.CSharp.bve_vehicle_spec=function(block){
  return ["_c.VSpec_"+block.getFieldValue("FIELD_SEL"), Blockly.CSharp.ORDER_MEMBER];
}
Blockly.CSharp.bve_location=function(block){
  return ["_c.EData_Vehicle_Location", Blockly.CSharp.ORDER_MEMBER];
}
Blockly.CSharp.bve_speed=function(block){
  return ["_c.EData_Vehicle_Speed", Blockly.CSharp.ORDER_MEMBER];
}
Blockly.CSharp.bve_time=function(block){
  return ["_c.EData_TotalTime", Blockly.CSharp.ORDER_MEMBER];
}
Blockly.CSharp.bve_vehicle_state=function(block){
  return ["_c.EData_Vehicle_" + block.getFieldValue("FIELD_SEL"), Blockly.CSharp.ORDER_MEMBER];
}
Blockly.CSharp.bve_get_handle=function(block){
  var handleName = block.getFieldValue("FIELD_SEL"); if (handleName == "Power" || handleName == "Brake") handleName += "Notch";
  return ["_c.EData_Handles_" + handleName, Blockly.CSharp.ORDER_MEMBER];
}
Blockly.CSharp.bve_set_handle=function(block){
  var handleID = ["Brake", "Power", "Reverser", "ConstSpeed"].indexOf(block.getFieldValue("FIELD_SEL"));
  return "_c.SetHandle(" + handleID + ", C.Int("
    + (Blockly.CSharp.valueToCode(block, "VALUE", Blockly.CSharp.ORDER_NONE) || "0") + "));\n";
}
Blockly.CSharp.bve_sound_stop=function(block){
  return "_c.SetLegacySound(C.Int(" + Blockly.CSharp.valueToCode(block, "ID", Blockly.CSharp.ORDER_NONE) + "), -10000);\n";
}
Blockly.CSharp.bve_sound_play_once=function(block){
  return "_c.SetLegacySound(C.Int(" + Blockly.CSharp.valueToCode(block, "ID", Blockly.CSharp.ORDER_NONE) + "), 1);\n";
}
Blockly.CSharp.bve_sound_play_loop=function(block){
  return "_c.SetLegacySoundLV(C.Int(" + Blockly.CSharp.valueToCode(block, "ID", Blockly.CSharp.ORDER_NONE) + "), C.Dbl(" + 
    Blockly.CSharp.valueToCode(block, "VOLUME", Blockly.CSharp.ORDER_NONE) + "));\n";
}
Blockly.CSharp.bve_get_sound_internal=function(block){
  return ["_c.GetLegacySound(C.Int(" + Blockly.CSharp.valueToCode(block, "ID", Blockly.CSharp.ORDER_NONE) + "))", 
    Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_set_sound_internal=function(block){
  return "_c.SetLegacySound(C.Int(" + Blockly.CSharp.valueToCode(block, "ID", Blockly.CSharp.ORDER_NONE) + "), C.Int(" + 
    Blockly.CSharp.valueToCode(block, "INTERNAL_VAL", Blockly.CSharp.ORDER_NONE) + "));\n";
}
Blockly.CSharp.bve_set_panel=function(block){
  return "_c.SetPanel(C.Int(" + Blockly.CSharp.valueToCode(block, "ID", Blockly.CSharp.ORDER_NONE) + "), C.Int(" + 
    Blockly.CSharp.valueToCode(block, "VALUE", Blockly.CSharp.ORDER_NONE) + "));\n";
}
Blockly.CSharp.bve_get_panel=function(block){
  return ["_c.GetPanel(C.Int(" + Blockly.CSharp.valueToCode(block, "ID", Blockly.CSharp.ORDER_NONE) + "))", 
    Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_key=function(block){
  return [["S","A1","A2","B1","B2","C1","C2","D","E","F","G","H","I","J","K","L"].indexOf(block.getFieldValue("KEY_TYPE")),
    Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_get_key=function(block){
  return ["_c.KeyState[C.Int(" + Blockly.CSharp.valueToCode(block, "KEY_TYPE", Blockly.CSharp.ORDER_NONE) + ")]",
    Blockly.CSharp.ORDER_MEMBER];
}
Blockly.CSharp.bve_horn=function(block){
  return [["Primary", "Secondary", "Music"].indexOf(block.getFieldValue("KEY_TYPE")), Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_get_door=function(block){
  return ["_c.LegacyDoorState", Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_init_mode=function(block){
  return ["_pinitindex", Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_updown_key=function(block){
  return ["_pkey", Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_horn_blew=function(block){
  return ["_phorntype", Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_signal_aspect=function(block){
  return ["_psignal", Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_get_beacon=function(block){
  var propName = block.getFieldValue("FIELD_SEL");
  return ["_pbeacon" + propName, Blockly.CSharp.ORDER_MEMBER];
}
Blockly.CSharp.bve_config_load=function(block){
  return "_f.LoadConfig(" + Blockly.CSharp.quote_(block.getFieldValue("PATH")) + ");\n";
}
Blockly.CSharp.bve_config_save=function(block){
  return "_f.SaveConfig(" + Blockly.CSharp.quote_(block.getFieldValue("PATH")) + ");\n";
}
Blockly.CSharp.bve_get_config=function(block){
  return ["_f.GetConfig(" + Blockly.CSharp.quote_(block.getFieldValue("PART")) + ", " 
    + Blockly.CSharp.quote_(block.getFieldValue("KEY")) + ")", Blockly.CSharp.ORDER_ATOMIC];
}
Blockly.CSharp.bve_get_config_default=function(block){ // TODO
  return [
    "_f.GetConfig(" + Blockly.CSharp.quote_(block.getFieldValue("PART")) + ", " 
    + Blockly.CSharp.quote_(block.getFieldValue("KEY")) + ", ("
    + Blockly.CSharp.valueToCode(block, "DEFAULT_VAL", Blockly.CSharp.ORDER_NONE) +"))",
    Blockly.CSharp.ORDER_ATOMIC
  ];
}
Blockly.CSharp.bve_set_config=function(block){
  return "_f.SetConfig(" + Blockly.CSharp.quote_(block.getFieldValue("PART")) + ", " 
    + Blockly.CSharp.quote_(block.getFieldValue("KEY")) + ", ("
    + (Blockly.CSharp.valueToCode(block, "VALUE", Blockly.CSharp.ORDER_NONE) || "\"\"") + "));\n";
}
Blockly.CSharp.bve_msgbox=function(block){
  return "_f.MsgBox(" + (Blockly.CSharp.valueToCode(block, "MSG", Blockly.CSharp.ORDER_NONE) || "\"\"") + ");\n";
}
Blockly.CSharp.bve_exception=function(block){
  return "throw new FunctionCompanion.AtsCustomException(" + (Blockly.CSharp.valueToCode(block, "MSG", Blockly.CSharp.ORDER_NONE) || "\"\"") + ");\n";
}
Blockly.CSharp.bve_hat_timer=function(block){
  var timerName = Blockly.CSharp.bveTimerNameDB.getName(block.getFieldValue("NAME"), Blockly.Generator.NAME_TYPE);
  return "public void _etimertick_" + timerName + "() {\n";
}
Blockly.CSharp.bve_timer_set=function(block){
  var timerName = Blockly.CSharp.bveTimerNameDB.getName(block.getFieldValue("NAME"), Blockly.Generator.NAME_TYPE);
  return "_f.SetTimer(" 
    + Blockly.CSharp.quote_(timerName) + ", C.Int("
    + Blockly.CSharp.valueToCode(block, "INTERVAL", Blockly.CSharp.ORDER_NONE) + "), C.Bool("
    + Blockly.CSharp.valueToCode(block, "CYCLE", Blockly.CSharp.ORDER_NONE) + "));\n";
}
Blockly.CSharp.bve_timer_modify=function(block){
  var timerName = Blockly.CSharp.bveTimerNameDB.getName(block.getFieldValue("NAME"), Blockly.Generator.NAME_TYPE);
  switch (block.getFieldValue("OPERATION")) {
    case "Stop":
      return "_f.CancelTimer(" + Blockly.CSharp.quote_(timerName) + ", false);\n";
    case "TrigStop":
      return "_f.CancelTimer(" + Blockly.CSharp.quote_(timerName) + ", true);\n";
    case "Reset":
      return "_f.ResetTimer(" + Blockly.CSharp.quote_(timerName) + ", false);\n";
    case "TrigReset":
      return "_f.ResetTimer(" + Blockly.CSharp.quote_(timerName) + ", true);\n";
  }
}
Blockly.CSharp.bve_convert_to_double=function(block) {
  return ["C.Dbl(" + Blockly.CSharp.valueToCode(block, "SOURCE", Blockly.CSharp.ORDER_NONE) + ")", 
    Blockly.CSharp.ORDER_FUNCTION_CALL];
}
Blockly.CSharp.bve_convert_to_boolean=function(block) {
  return ["C.Bool(" + Blockly.CSharp.valueToCode(block, "SOURCE", Blockly.CSharp.ORDER_NONE) + ")", 
    Blockly.CSharp.ORDER_FUNCTION_CALL];
}
Blockly.CSharp.bve_convert_to_string=function(block) {
  return ["Convert.ToString(" + Blockly.CSharp.valueToCode(block, "SOURCE", Blockly.CSharp.ORDER_NONE) + ")", 
    Blockly.CSharp.ORDER_FUNCTION_CALL];
}
Blockly.CSharp.bve_can_convert_to=function(block) {
  return ["C.CanConvertTo" + block.getFieldValue("TYPE") + "(" + 
    Blockly.CSharp.valueToCode(block, "SOURCE", Blockly.CSharp.ORDER_NONE) + ")",
    Blockly.CSharp.ORDER_FUNCTION_CALL];
}
Blockly.CSharp.bve_comment = function(block) { return ""; }
Blockly.CSharp.bve_rawcode_statement = function(block) { return block.getFieldValue("CODE") + "\n"; }
Blockly.CSharp.bve_rawcode_value = function(block) { return block.getFieldValue("CODE"); }
