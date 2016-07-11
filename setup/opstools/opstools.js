/**
 * This file specifies any default Ops Portal Tool Definitions 
 * provided by this modlue.
 *  
 */
module.exports = [

    { 
        key:'process.translation', 
        permissions:'adcore.admin, adcore.developer, process.translation.tool.view', 
        icon:'fa-check-square', 
        controller:'ProcessTranslation',
        label:'opp.toolProcessTranslation',
        context:'opsportal',
        isController:true, 
        options:{}, 
        version:'0' 
    }

];
