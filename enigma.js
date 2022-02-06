const c = console;

let simpleText = 'ABCDEFGHIJ';
let cipherText = Encrypting(simpleText, 'AAA', 'AAA', '123' );
let simpleText2  = Encrypting(cipherText, 'AAA', 'AAA', '123' );

function Encrypting(simpleText, keySettings, ringSettings, rotorSettings) {
    c.log( 'Text => ' + simpleText );
    c.log( 'Key Setting => ' + keySettings );
    c.log( 'Ring Setting => ' + ringSettings );
    c.log( 'Rotor Settings => ' + rotorSettings );
        
    // настройки ротора (строки от 1-8 до int 0-7)
    let rotors = rotorSettings.split("");
    rotors[0] = rotors[0].valueOf()-1; //возврат примитивного значение указанного объекта
    rotors[1] = rotors[1].valueOf()-1;
    rotors[2] = rotors[2].valueOf()-1; 
     
    // конвертировать из букв в цифры 0-25
    key = keySettings.split("");
    key[0] = code(key[0]);
    key[1] = code(key[1]);
    key[2] = code(key[2]);

    ring = ringSettings.split("");
    ring[0] = code(ring[0]);
    ring[1] = code(ring[1]);
    ring[2] = code(ring[2]);


    // шифрование
    let cipherText = "";   
    for(i = 0; i < simpleText.length; i++){
        ch = simpleText.charAt(i);
        
        // символ не буква оставить без изменений

        if( !ch.match( /[A-Z]/ ) ){
            cipherText = cipherText + ch;
        } else {
            key = increment_settings( key, rotors );
            cipherText = cipherText + enigma(ch, key, rotors, ring);
        }
    }
    c.log( 'Cipher Text => ' + cipherText );
    return cipherText;
}

function enigma( ch, key, rotors, ring ){
	// применяем преобразования ротора справа налево

	ch = rotor( ch, rotors[2], key[2] - ring[2] );
	ch = rotor( ch, rotors[1], key[1] - ring[1] );
	ch = rotor( ch, rotors[0], key[0] - ring[0] );
	// отражение
	ch = simpleSub( ch, "YRUHQSLDPXNGOKMIEBFZCWVJAT" );
	// обратные преобразования ротора слева направо
	ch = rotor( ch, rotors[0] + 8,key[0] - ring[0] );
	ch = rotor( ch, rotors[1] + 8,key[1] - ring[1] );
	ch = rotor( ch, rotors[2] + 8,key[2] - ring[2] );
	return ch;
}

function increment_settings( key,r ){
	let notch = [['Q','Q'],['E','E'],['V','V'],['J','J'],['Z','Z'],['Z','M'],['Z','M'],['Z','M']];

    if( key[1] == notch[r[1]][0] || key[1] == notch[r[1]][1] ){
        key[0] = (key[0] + 1) % 26;
        key[1] = (key[1] + 1) % 26;
    }    
    if( key[2] == notch[r[2]][0] || key[2] == notch[r[2]][1] ){
        key[1] = (key[1] + 1) % 26;
    }
    key[2] = ( key[2] + 1 ) % 26;   
	  return key;
}
// простой шифр замены
function simpleSub( ch, key ){
	  return key.charAt(code(ch));
}

function rotor( ch, r, offset ){
        //подмена 
	  let key = ["EKMFLGDQVZNTOWYHXUSPAIBRCJ","AJDKSIRUXBLHWTMCQGZNPYFVOE","BDFHJLCPRTXVZNYEIWGAKMUSQO",
               "ESOVPZJAYQUIRHXLNFTGKDCMWB","VZBRGITYUPSDNHLXAWMJQOFECK","JPGVOUMFYQBENHZRDKASXLICTW",
               "NZJHGRCXMYSWBOUFAIVLPEKQDT","FKQHTLXOCBJSPDZRAMEWNIUYGV",
        //инверсия       
               "UWYGADFPVZBECKMTHXSLRINQOJ","AJPCZWRLFBDKOTYUQGENHXMIVS","TAGBPCSDQEUFVNZHYIXJWLRKOM",
               "HZWVARTNLGUPXQCEJMBSKDYOIF","QCYLXWENFTZOSMVJUDKGIARPHB","SKXQLHCNWARVGMEBJPTYFDZUIO",
               "QMGYVPEDRCWTIANUXFKZOSLHJB","QJINSAYDVKBFRUHMCPLEWZTGXO"];
 
     let chcode = ( code(ch) + 26 + offset ) % 26;
     let mapch = ( code( key[r].charAt(chcode) ) + 26-offset ) % 26 + 65;
     return String.fromCharCode( mapch );
}

// вернуть число 0-25 с учетом буквы [A-Za-z]
function code(ch){ 
    return ch.toUpperCase().charCodeAt(0) - 65;
 }