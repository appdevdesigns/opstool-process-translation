/**
 * This file specifies any default Ops Portal Tool Definitions 
 * provided by this modlue.
 *  
 */
module.exports = [

    { 
        key:'process.translation', 
        permissions:'process.translation.tool.view', 
        icon:'fa-check-square', 
        controller:'ProcessTranslation',
        label:'Process Translation',
        // context:'opsportal',
        isController:true, 
        options:{}, 
        version:'0' 
    }

];
