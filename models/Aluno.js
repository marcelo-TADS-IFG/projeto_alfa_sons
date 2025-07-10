class Aluno {
    constructor(nome, sobrenome, turma) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.turma = Aluno.formatarTurma(turma);
    }

    static formatarTurma(turma) {
        if (!turma) return '';
        // Remove espaços extras, coloca tudo em maiúsculo e substitui "º" por "°"
        let t = turma.trim().toUpperCase().replace(/º/g, '°');
        // Corrige padrões comuns (adicione mais conforme necessário)
        t = t.replace(/1[\s-]*A/, '1° - A')
             .replace(/1[\s-]*B/, '1° - B')
             .replace(/2[\s-]*A/, '2° - A')
             .replace(/2[\s-]*B/, '2° - B')
             .replace(/3[\s-]*A/, '3° - A')
             .replace(/3[\s-]*B/, '3° - B')
             .replace(/4[\s-]*A/, '4° - A')
             .replace(/4[\s-]*B/, '4° - B')
             .replace(/5[\s-]*A/, '5° - A')
             .replace(/5[\s-]*B/, '5° - B')
             .replace(/JARDIN[\s-]*1/, 'JARDIN - 1')
             .replace(/JARDIN[\s-]*2/, 'JARDIN - 2');
        return t;
    }

    getNomeCompleto() {
        return `${this.nome} ${this.sobrenome}`.trim();
    }

    getTurma() {
        return this.turma;
    }
}

module.exports = Aluno; 