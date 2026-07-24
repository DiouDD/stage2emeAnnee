import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { OrangeAviSviService } from './orange_avi_svi.service';
import { OrangeAviSvi } from './orange_avi_svi.model';
import { OrangeAviSvi2Service } from './orange_avi_svi2.service';
import { OrangeAviSvi2 } from './orange_avi_svi2.model';
import { OrangeAviProfileService } from '../profile/orange_avi_profile.service';
import { OrangeAviProfile } from '../profile/orange_avi_profile.model';

interface SviMenuRow<T> {
  label: string;
  actionField: keyof T;
  chField: keyof T;
}

function emptySvi(): OrangeAviSvi {
  return {
    uid: 0,
    menu_0_action: null,
    menu_0_ch: null,
    menu_1_action: null,
    menu_1_ch: null,
    menu_2_action: null,
    menu_2_ch: null,
    menu_3_action: null,
    menu_3_ch: null,
    menu_4_action: null,
    menu_4_ch: null,
    menu_5_action: null,
    menu_5_ch: null,
    menu_diese_action: null,
    menu_diese_ch: null,
    menu_etoile_action: null,
    menu_etoile_ch: null,
    audio_svi: 'Aucun',
  };
}

function emptySvi2(): OrangeAviSvi2 {
  return {
    uid: 0,
    menu_0_action: null,
    menu_0_ch: null,
    menu_1_action: null,
    menu_1_ch: null,
    menu_2_action: null,
    menu_2_ch: null,
    menu_3_action: null,
    menu_3_ch: null,
    menu_4_action: null,
    menu_4_ch: null,
    menu_5_action: null,
    menu_5_ch: null,
    menu_diese_action: null,
    menu_diese_ch: null,
    menu_etoile_action: null,
    menu_etoile_ch: null,
    audio_svi: 'Aucun',
  };
}

@Component({
  selector: 'ngx-orange-avi-svi',
  templateUrl: './orange_avi_svi.component.html',
  styleUrls: ['./orange_avi_svi.component.scss']
})
export class OrangeAviSviComponent implements OnInit {

  @Input() profile!: OrangeAviProfile;

  svi: OrangeAviSvi = emptySvi();
  svi2: OrangeAviSvi2 = emptySvi2();
  audioOptions: string[] = [];
  readonly actionOptions: string[] = ['campagne', 'Extention', 'Numero', 'SVI2'];
  isSaving: boolean = false;

  readonly menuRows: SviMenuRow<OrangeAviSvi>[] = [
    { label: '1', actionField: 'menu_1_action', chField: 'menu_1_ch' },
    { label: '2', actionField: 'menu_2_action', chField: 'menu_2_ch' },
    { label: '3', actionField: 'menu_3_action', chField: 'menu_3_ch' },
    { label: '4', actionField: 'menu_4_action', chField: 'menu_4_ch' },
    { label: '5', actionField: 'menu_5_action', chField: 'menu_5_ch' },
    { label: '0', actionField: 'menu_0_action', chField: 'menu_0_ch' },
    { label: '#', actionField: 'menu_diese_action', chField: 'menu_diese_ch' },
    { label: '*', actionField: 'menu_etoile_action', chField: 'menu_etoile_ch' },
  ];

  readonly menuRows2: SviMenuRow<OrangeAviSvi2>[] = [
    { label: '1', actionField: 'menu_1_action', chField: 'menu_1_ch' },
    { label: '2', actionField: 'menu_2_action', chField: 'menu_2_ch' },
    { label: '3', actionField: 'menu_3_action', chField: 'menu_3_ch' },
    { label: '4', actionField: 'menu_4_action', chField: 'menu_4_ch' },
    { label: '5', actionField: 'menu_5_action', chField: 'menu_5_ch' },
    { label: '0', actionField: 'menu_0_action', chField: 'menu_0_ch' },
    { label: '#', actionField: 'menu_diese_action', chField: 'menu_diese_ch' },
    { label: '*', actionField: 'menu_etoile_action', chField: 'menu_etoile_ch' },
  ];

  constructor(
    protected dialogRef: NbDialogRef<OrangeAviSviComponent>,
    private oasviService: OrangeAviSviService,
    private oasvi2Service: OrangeAviSvi2Service,
    private oapService: OrangeAviProfileService,
  ) {}

  ngOnInit(): void {
    this.oapService.getAudioOptions().subscribe(data => {
      this.audioOptions = data;
    });
    this.loadSvi();
    this.loadSvi2();
  }

  private loadSvi(): void {
    if (!this.profile) return;
    this.oasviService.getOasvisByProfile(this.profile.uid).subscribe({
      next: (data) => {
        this.svi = data.length > 0 ? data[0] : emptySvi();
        if (!this.svi.audio_svi) {
          this.svi.audio_svi = 'Aucun';
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du SVI :', err);
        this.svi = emptySvi();
      }
    });
  }

  private loadSvi2(): void {
    if (!this.profile) return;
    this.oasvi2Service.getOasvi2sByProfile(this.profile.uid).subscribe({
      next: (data) => {
        this.svi2 = data.length > 0 ? data[0] : emptySvi2();
        if (!this.svi2.audio_svi) {
          this.svi2.audio_svi = 'Aucun';
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du SVI 2 :', err);
        this.svi2 = emptySvi2();
      }
    });
  }

  getField(field: keyof OrangeAviSvi): string | null {
    const value = this.svi[field];
    return value == null ? null : String(value);
  }

  setField(field: keyof OrangeAviSvi, value: string): void {
    (this.svi as any)[field] = value === '' ? null : value;
  }

  getField2(field: keyof OrangeAviSvi2): string | null {
    const value = this.svi2[field];
    return value == null ? null : String(value);
  }

  setField2(field: keyof OrangeAviSvi2, value: string): void {
    (this.svi2 as any)[field] = value === '' ? null : value;
  }

  actionOptionsFor(field: keyof OrangeAviSvi): string[] {
    const current = this.getField(field);
    return current && !this.actionOptions.includes(current)
      ? [current, ...this.actionOptions]
      : this.actionOptions;
  }

  actionOptionsFor2(field: keyof OrangeAviSvi2): string[] {
    const current = this.getField2(field);
    return current && !this.actionOptions.includes(current)
      ? [current, ...this.actionOptions]
      : this.actionOptions;
  }

  onClearRow(row: SviMenuRow<OrangeAviSvi>): void {
    (this.svi as any)[row.actionField] = null;
    (this.svi as any)[row.chField] = null;
  }

  onClearRow2(row: SviMenuRow<OrangeAviSvi2>): void {
    (this.svi2 as any)[row.actionField] = null;
    (this.svi2 as any)[row.chField] = null;
  }

  onApply(): void {
    if (!this.profile) return;

    this.isSaving = true;
    this.applySvi();
    this.applySvi2();
  }

  private applySvi(): void {
    const { profile, uid, ...rest } = this.svi;
    const payload = { ...rest, profileUid: this.profile.uid } as OrangeAviSvi;

    if (this.svi.uid) {
      this.oasviService.updateOasvi(this.svi.uid, payload).subscribe({
        next: (updated) => {
          this.svi = updated;
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du SVI :', err);
          alert("Erreur lors de l'enregistrement du SVI.");
          this.isSaving = false;
        }
      });
    } else {
      this.oasviService.addOasvi(payload).subscribe({
        next: (created) => {
          this.svi = created;
          this.isSaving = false;
        },
        error: (err) => {
          console.error("Erreur lors de la création du SVI :", err);
          alert("Erreur lors de l'enregistrement du SVI.");
          this.isSaving = false;
        }
      });
    }
  }

  private applySvi2(): void {
    const { profile, uid, ...rest } = this.svi2;
    const payload = { ...rest, profileUid: this.profile.uid } as OrangeAviSvi2;

    if (this.svi2.uid) {
      this.oasvi2Service.updateOasvi2(this.svi2.uid, payload).subscribe({
        next: (updated) => {
          this.svi2 = updated;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du SVI 2 :', err);
          alert("Erreur lors de l'enregistrement du SVI 2.");
        }
      });
    } else {
      this.oasvi2Service.addOasvi2(payload).subscribe({
        next: (created) => {
          this.svi2 = created;
        },
        error: (err) => {
          console.error("Erreur lors de la création du SVI 2 :", err);
          alert("Erreur lors de l'enregistrement du SVI 2.");
        }
      });
    }
  }

  onRetour(): void {
    this.dialogRef.close();
  }
}
