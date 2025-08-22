export class Patterns {
    public static mobile: string = "^[1-9][0-9]{8}$"; 
    public static indicatifMobile: string = "[+0-9]{13}"; 
    public static fixe: string = "^[0-9][0-9]{7}$"; 
    public static email: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
    public static number: string = "^[0-9]*$"; 
    public static alphanumerique: string = "^[a-zA-Z0-9_]*$";
    public static string: string = "^[a-zA-Z \-\']+"; 
    public static nom: string = "^[a-zA-Z0-9-' À-ÿ]+"; 
    public static indicatifFix: string = "[+0-9]{12}";
    public static NIN: string = "[0-9]{18}";
    public static NIF : string = "[0-9]{15,20}";
    public static RIB : string = "[0-9]{20}";
    public static slash : string = "[/]";
} 