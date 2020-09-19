import React, { ChangeEvent, FormEvent, useState, useCallback } from 'react';
import Input from '../Input';
import Textarea from '../Textarea';
import Select, { OptionsTypes } from '../Select';
import ToggleSwitch from '../ToggleSwitch';
import Button from '../Button';
import { BodyAcademicForm } from './styles';
import { inputChange } from "../../utils/inputChange";
import { selectChange } from "../../utils/selectChange";
import { textareaChange } from "../../utils/textareaChange";
import { yearOptions,monthOptions } from "../../utils/dates";
import axios, { AxiosError } from "axios";

const ProjectExperiences: React.FC = () => {
  const [register, setRegister] = useState<boolean>(false)
  const vinculos: OptionsTypes[] = [
    { label: "Trainee", value: "Trainee" },
    { label: "Terceirizado", value: "Terceirizado" },
    { label: "Intermitente", value: "Intermitente" },
    { label: "Aprendiz", value: "Aprendiz" },
    { label: "Estágio", value: "Estágio" },
    { label: "Temporário", value: "Temporário" },
    { label: "Freelance", value: "Freelance" },
    { label: "Autônomo", value: "Autônomo" },
    { label: "Meio Período", value: "Meio Período" },
    { label: "Tempo Integral", value: "Tempo Integral" },
  ];

  const [projectFormData, setProjectFormData] = useState({
    position: "",
    projectName: "",
    initialYear: "",
    finalYear: "",
    details: "",
    situation: "",
    currentlyWorking: false,
  });

  

  /**
   * The useCallback hook will act as the bind method so we can
   * use the generalized function in this scope. Note that memoization
   * doesn't actually improve performance here
   * reference: https://reactjs.org/docs/hooks-reference.html#usecallback
   */
  const handleInputChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      setFormData: Function,
      formData: {}
    ) => {
      inputChange(event, setFormData, formData);
    },
    []
  );

  const handleTextAreaChange = useCallback(
    (
      event: ChangeEvent<HTMLTextAreaElement>,
      setFormData: Function,
      formData: {}
    ) => {
      textareaChange(event, setFormData, formData);
    },
    []
  );

  const handleSelectChange = useCallback(
    (
      event: ChangeEvent<HTMLSelectElement>,
      setFormData: Function,
      formData: {}
    ) => {
      selectChange(event, setFormData, formData);
    },
    []
  );


  async function handleProjectSubmit(event: FormEvent) {
    event.preventDefault();

    const {
      currentlyWorking,
      projectName,
      position,
      details,
      finalYear,
      initialYear,
      situation
    }: {
      projectName: string;
      details: string;
      currentlyWorking: boolean;
      position: string;
      situation: string;
      initialYear: string;
      // Supressing "The operand of a 'delete' operator must be optional" warning
      finalYear: any;
    } = projectFormData;

    const data = {
      nome: projectName,
      descricao: details,
      data_inicio: initialYear,
      data_fim: finalYear,
      cargo: position,
      situacao: situation
    };

    if (!currentlyWorking) {
      delete data["data_fim"];
    }

    /**
     * Sends data to backend
     * It's important to notice the withCredentials being true here
     * so it will send the JWT token as cookie
     * */
    const res = await axios
      .post("/api/v1/experiencias/projeto", data, {
        withCredentials: true,
      })
      .catch((err: AxiosError) => {
        // Returns error message from backend
        return err?.response?.data.detail;
      });
    console.log(res);

    // Do something
  }

  

  // Project functions
  function handleProjectInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleInputChange(event, setProjectFormData, projectFormData);
  }
  function handleProjectSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    handleSelectChange(event, setProjectFormData, projectFormData);
  }
  function handleProjectTextAreaChange(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    handleTextAreaChange(event, setProjectFormData, projectFormData);
  }

  return (
    <BodyAcademicForm>

      <section className="caracteristicas">
        <h2>Projetos</h2>

        {!register ? (
          <div className="experiencias">
            
            <button onClick={() => setRegister(true)}>
              <span>+ </span>
                Adicionar
              </button>
          </div>
        ) : (
            <form className="form--experiencia" onSubmit={handleProjectSubmit}>
              <aside className="area-registro">
                <section className="bloco-um">
                  <Input
                    label="Nome do projeto"
                    name="projectName"
                    onChange={handleProjectInputChange}
                  />
                </section>
                <section className="bloco-dois">
                  <Select
                    label="Situação"
                    name="situation"
                    options={vinculos}
                    defaultOption="Selecione"
                  />

                  <Input
                    label="Cargo"
                    name="position"
                    onChange={handleProjectInputChange}
                  />
                </section>
                <section className="bloco-tres">
                  <aside>
                    {/*
                      COMMENT 
                      I'll keep this, but this is not how the backend was structured
                      As it was structured to be a full date, we may have to just change it
                      to be a string instead, but it will be more demanding to make queries by year
                    */}
                    <Select
                      label="Mês inicial"
                      name="initialMonth"
                      options={monthOptions}
                      defaultOption="Selecione"
                    // onChange={handleProjectSelectChange}
                    />
                    <Select
                      label="Ano inicial"
                      name="initialYear"
                      options={yearOptions}
                      defaultOption="Selecione"
                      onChange={handleProjectSelectChange}
                      value={projectFormData.initialYear}
                    />
                  </aside>
                  <aside>
                    <ToggleSwitch
                      label="Estou nesse projeto atualmente"
                      name="currentlyWorking"
                      id="currentlyWorking"
                    />
                  </aside>
                  <aside>
                    <Select
                      label="Mês final"
                      name="initialMonth"
                      options={monthOptions}
                      defaultOption="Selecione"
                    />
                    <Select
                      label="Ano final"
                      name="finalYear"
                      options={yearOptions}
                      defaultOption="Selecione"
                      onChange={handleProjectSelectChange}
                      value={projectFormData.finalYear}
                    />
                  </aside>
                </section>
                <section className="bloco-quatro">
                  <Textarea
                    name="details"
                    label="Detalhes"
                    onChange={handleProjectTextAreaChange}
                  />
                </section>
                <section className="area-botoes">
                  <Button type="submit" theme="primary-green">Salvar</Button>
                  <Button theme="secondary-green">Excluir</Button>
                  <Button
                    onClick={() => setRegister(false)}
                  >
                    Cancelar
                  </Button>
                </section>
              </aside>
            </form>
          )}
      </section>


    </BodyAcademicForm>

  )

}

export default ProjectExperiences;